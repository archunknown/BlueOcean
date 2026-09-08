import { createClient } from '@/utils/supabase/server';
import { matchFAQ } from '@/services/faq-service';
import { getAllTours } from '@/services/tours';
import type { Tour } from '@/types/tour-schemas';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROK_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'openai/gpt-oss-20b';

const SYSTEM_PROMPT_INTRO = `Eres el asistente oficial de Inteligencia Artificial de "Blue Ocean Paracas Tours", una agencia de turismo líder en Paracas, Perú.
Tu objetivo es guiar de forma amable, clara y servicial a los turistas que consultan sobre nuestros tours, alquileres y servicios de asistencia.`;

const SYSTEM_PROMPT_RULES = `=== REGLAS IMPORTANTES ===
- **Pagos Online**: Se realizan únicamente a través de la pasarela segura MercadoPago (con confirmación automática vía webhook).
- **Pagos Presenciales**: Se pueden realizar en la agencia en efectivo o mediante Yape/Transferencia. La reserva se mantendrá "PENDIENTE" hasta que nuestro personal valide el cobro en el panel de control.
- **Custodia Gratuita**: Ofrecemos almacenamiento logístico temporal de equipaje y mascotas para todos nuestros clientes de forma gratuita mientras realizan sus actividades.
- **Tono**: Amable, profesional y acogedor. Si el usuario solicita hablar con un humano o si no sabes la respuesta a una pregunta muy específica de reservas existentes, indícalo de forma atenta indicando que derivarás su consulta al personal.
- **Precios**: Respeta estrictamente los precios listados en el catálogo de abajo. No ofrezcas descuentos sin autorización ni inventes tarifas adicionales.
- **Catálogo**: El catálogo que se te entrega en cada mensaje viene directo de la base de datos y refleja los tours y alquileres activos en este momento. No asumas que existen tours que no aparecen listados, ni sigas usando precios de mensajes anteriores en esta conversación si el catálogo actual los contradice.
`;

// ── Catálogo dinámico de tours ──────────────────────────────────────────
// Se construye consultando la tabla `tours` en cada mensaje que escala a
// LLM, con una caché en memoria de corta duración para no golpear la BD
// en cada mensaje de WhatsApp cuando hay varias conversaciones seguidas.
const CATALOG_TTL_MS = 5 * 60 * 1000; // 5 minutos
let catalogCache: { text: string; expiresAt: number } | null = null;

function formatSchedule(tour: Tour): string {
    if (tour.is_flexible_schedule) return 'Flexible, a coordinar con el cliente.';
    if (tour.time_slots && tour.time_slots.length > 0) return tour.time_slots.join(', ');
    return 'Consultar disponibilidad.';
}

async function getToursCatalogText(): Promise<string> {
    const now = Date.now();
    if (catalogCache && catalogCache.expiresAt > now) {
        return catalogCache.text;
    }

    try {
        const tours = await getAllTours({ onlyActive: true });

        if (!tours.length) {
            const fallback = 'En este momento no hay tours ni alquileres activos publicados. Indica al cliente que un asesor le compartirá el catálogo actualizado.';
            catalogCache = { text: fallback, expiresAt: now + CATALOG_TTL_MS };
            return fallback;
        }

        const grouped = tours.reduce<Record<string, Tour[]>>((acc, tour) => {
            const key = tour.category || 'Tour';
            (acc[key] ||= []).push(tour);
            return acc;
        }, {});

        let text = '';
        let counter = 1;
        for (const [category, items] of Object.entries(grouped)) {
            text += `\n=== ${category.toUpperCase()} ===\n`;
            for (const t of items) {
                text += `${counter}. **${t.title}**\n`;
                text += `   - Precio: S/ ${t.price}.\n`;
                text += `   - Duración: ${t.duration || 'Consultar'}.\n`;
                text += `   - Detalle: ${t.short_description}\n`;
                text += `   - Horario: ${formatSchedule(t)}\n\n`;
                counter++;
            }
        }

        catalogCache = { text, expiresAt: now + CATALOG_TTL_MS };
        return text;
    } catch (err) {
        console.error('[AI_GENERATOR] Error obteniendo catálogo dinámico de tours:', err);
        if (catalogCache) return catalogCache.text;
        return 'No fue posible cargar el catálogo actualizado en este momento. Indica al cliente que un asesor confirmará precios y disponibilidad.';
    }
}

async function buildSystemPrompt(): Promise<string> {
    const catalog = await getToursCatalogText();
    return `${SYSTEM_PROMPT_INTRO}\n\nAquí tienes el catálogo ACTUALIZADO de nuestros tours y alquileres (viene directo de la base de datos, siempre vigente):\n${catalog}\n${SYSTEM_PROMPT_RULES}`;
}

import { createPaymentPreference } from '../payments/mercadopago';

export interface MessageHistory {
    role: 'user' | 'assistant';
    content: string;
}

const TOOL_DESCRIPTION = "Genera un enlace de pago seguro de Mercado Pago para procesar la reserva de un tour o alquiler. Úsalo SOLO cuando el usuario confirme explícitamente su intención de reservar y pagar, y tengas todos los datos (título, cantidad, precio unitario).";

async function processTextToolCalls(text: string, senderPhone?: string): Promise<string> {
    const functionRegex = /<?function=createPaymentPreference>([\s\S]*?)(?:<\/function>|$)/i;
    const match = functionRegex.exec(text);
    
    if (match) {
        try {
            const rawJson = match[1].trim();
            const args = JSON.parse(rawJson);
            const initPoint = await createPaymentPreference(args.title, args.quantity, args.unitPrice, senderPhone || '');
            
            if (initPoint) {
                return text.replace(functionRegex, `\n\nAquí tienes tu enlace de pago seguro con Mercado Pago:\n\n${initPoint}\n\nQuedamos a la espera de la confirmación de tu pago para registrar la reserva.`);
            } else {
                return text.replace(functionRegex, `\n\n[Lo siento, hubo un problema al generar el enlace de pago. Por favor, solicita asistencia manual a un asesor.]\n`);
            }
        } catch (e) {
            console.error("[AI_GENERATOR] Error parsing text tool call JSON:", e);
            return text.replace(functionRegex, `\n\n[Error interno al generar enlace de pago. Solicita asistencia de un asesor.]\n`);
        }
    }
    
    return text;
}

/**
 * Generates an AI response using the Gemini API.
 */
async function callGemini(apiKey: string, systemPrompt: string, userMessage: string, history: MessageHistory[] = [], senderPhone?: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`;
    
    const contents = history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const payload = {
        contents,
        systemInstruction: {
            parts: [{ text: systemPrompt + "\n\nSi necesitas procesar un pago, pide todos los detalles al usuario antes de usar la herramienta de pagos. También puedes usar el formato de texto <function=createPaymentPreference>{...}</function> si lo prefieres." }]
        },
        tools: [{
            functionDeclarations: [{
                name: "createPaymentPreference",
                description: TOOL_DESCRIPTION,
                parameters: {
                    type: "OBJECT",
                    properties: {
                        title: { type: "STRING", description: "Título del tour o alquiler (ej. 'Tour Islas Ballestas')" },
                        quantity: { type: "INTEGER", description: "Cantidad de personas o ítems" },
                        unitPrice: { type: "NUMBER", description: "Precio unitario en PEN" }
                    },
                    required: ["title", "quantity", "unitPrice"]
                }
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];
    
    if (part?.functionCall && part.functionCall.name === 'createPaymentPreference') {
        const args = part.functionCall.args;
        const initPoint = await createPaymentPreference(args.title, args.quantity, args.unitPrice, senderPhone || '');
        if (initPoint) {
            return `¡Excelente! He generado tu enlace de pago seguro para ${args.title} (${args.quantity} pax). Puedes pagarlo con Mercado Pago aquí:\n${initPoint}`;
        } else {
            return `Lo siento, hubo un problema al generar el enlace de pago. Por favor, intenta nuevamente en unos minutos o solicita asistencia de un asesor.`;
        }
    }

    let reply = part?.text;
    if (!reply) {
        throw new Error('No candidate content returned from Gemini.');
    }
    
    reply = await processTextToolCalls(reply, senderPhone);
    return reply.trim();
}

/**
 * Generates an AI response using the Groq API.
 */
async function callGroq(apiKey: string, systemPrompt: string, userMessage: string, history: MessageHistory[] = [], senderPhone?: string): Promise<string> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const messages = [
        { role: 'system', content: systemPrompt + "\n\nSi necesitas procesar un pago, pide todos los detalles al usuario antes de usar la herramienta de pagos. También puedes usar el formato de texto <function=createPaymentPreference>{...}</function> si lo prefieres." },
        ...history,
        { role: 'user', content: userMessage }
    ];

    const payload = {
        model: GROQ_MODEL,
        messages,
        tools: [{
            type: "function",
            function: {
                name: "createPaymentPreference",
                description: TOOL_DESCRIPTION,
                parameters: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Título del tour o alquiler" },
                        quantity: { type: "number", description: "Cantidad de personas o ítems" },
                        unitPrice: { type: "number", description: "Precio unitario en PEN" }
                    },
                    required: ["title", "quantity", "unitPrice"]
                }
            }
        }],
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 500
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    if (message?.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        if (toolCall.function.name === 'createPaymentPreference') {
            const args = JSON.parse(toolCall.function.arguments);
            const initPoint = await createPaymentPreference(args.title, args.quantity, args.unitPrice, senderPhone || '');
            if (initPoint) {
                return `¡Excelente! He generado tu enlace de pago seguro para ${args.title} (${args.quantity} pax). Puedes pagarlo con Mercado Pago aquí:\n${initPoint}`;
            } else {
                return `Lo siento, hubo un problema al generar el enlace de pago. Por favor, intenta nuevamente en unos minutos o solicita asistencia de un asesor.`;
            }
        }
    }

    let reply = message?.content;
    if (!reply) {
        throw new Error('No completion returned from Groq.');
    }
    
    reply = await processTextToolCalls(reply, senderPhone);
    return reply.trim();
}

/**
 * Generates an AI response based on the user's message.
 * 
 * Capa 0: Verificación de sesión — si el estado es 'atencion_humana', omite IA y retorna vacío.
 * Detección de intención de traspaso — si el usuario pide un operador, marca la sesión y retorna mensaje de handover.
 * Capa 1: Búsqueda vectorial semántica en Supabase con pgvector (umbral >= 0.80).
 * Capa 2: Escalado a LLM (Groq con llama3-8b-8192 primero; Gemini 1.5 Flash como fallback).
 * 
 * Si se provee `senderPhone`, gestiona la sesión e inserta la interacción en `intent_logs`.
 */

const HANDOVER_PATTERN = /\b(operador|asesor|agente|atenci[oó]n humana|hablar con alguien|persona real|hablar con un humano)\b/i;
const HANDOVER_REPLY = 'Entendido. He transferido tu consulta a un operador humano de Blue Ocean Paracas Tours. Un asesor te responderá por este medio a la brevedad.';

export async function generateAIResponse(userMessage: string, senderPhone?: string): Promise<string> {
    const startTime = Date.now();
    let replyText = '';
    let handledBy: 'pgvector' | 'llm' | 'human_takeover' = 'pgvector';
    let matchedIntent: string | null = null;
    let score: number | null = null;

    // ── Capa 0: Verificación de estado de sesión ────────────────────────
    if (senderPhone) {
        try {
            const supabase = await createClient();
            const { data: conv } = await supabase
                .from('conversations')
                .select('id, estado')
                .eq('phone_number', senderPhone)
                .maybeSingle();

            if (conv && conv.estado === 'atencion_humana') {
                console.log(`[AI_GENERATOR] Sesión ${senderPhone} en modo operador humano. Omitiendo IA.`);
                return '';
            }
        } catch (err) {
            console.error('[AI_GENERATOR] Error verificando estado de sesión:', err);
        }
    }

    // ── Detección de intención de traspaso a operador ────────────────────
    if (HANDOVER_PATTERN.test(userMessage)) {
        console.log(`[AI_GENERATOR] Intención de traspaso detectada: "${userMessage}"`);
        handledBy = 'human_takeover';
        matchedIntent = 'human_handover';
        replyText = HANDOVER_REPLY;

        if (senderPhone) {
            try {
                const supabase = await createClient();
                const latencyMs = Date.now() - startTime;

                // Obtener o crear conversación
                let conversationId: string | null = null;
                const { data: conv, error: convError } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('phone_number', senderPhone)
                    .maybeSingle();

                if (convError) {
                    console.error('[SUPABASE_ERROR] Error fetching conversation:', convError);
                } else if (conv) {
                    conversationId = conv.id;
                    // Actualizar estado a atencion_humana
                    await supabase
                        .from('conversations')
                        .update({ estado: 'atencion_humana' })
                        .eq('id', conversationId);
                } else {
                    const { data: newConv } = await supabase
                        .from('conversations')
                        .insert({ phone_number: senderPhone, estado: 'atencion_humana' })
                        .select('id')
                        .single();
                    if (newConv) conversationId = newConv.id;
                }

                // Persistir log de handover
                if (conversationId) {
                    await supabase
                        .from('intent_logs')
                        .insert({
                            conversation_id: conversationId,
                            input_text: userMessage,
                            matched_intent: matchedIntent,
                            similarity_score: null,
                            handled_by: 'human_takeover',
                            response_text: replyText,
                            latency_ms: latencyMs,
                        });
                }
            } catch (dbErr) {
                console.error('[AI_GENERATOR] Error en persistencia de handover:', dbErr);
            }
        }

        return replyText;
    }

    // ── Capa 1: Similitud Vectorial Semántica (Supabase pgvector) ────────
    try {
        console.log('[AI_GENERATOR] Capa 1: Consultando similitud vectorial...');
        const faqMatches = await matchFAQ(userMessage, 0.80, 1);
        if (faqMatches && faqMatches.length > 0) {
            const bestMatch = faqMatches[0];
            replyText = bestMatch.respuesta;
            matchedIntent = bestMatch.pregunta;
            score = bestMatch.similarity;
            handledBy = 'pgvector';
            console.log(`[AI_GENERATOR] Capa 1 resuelta con éxito. Similitud: ${score}`);
        }
    } catch (vectorErr) {
        console.error('[AI_GENERATOR] Error en búsqueda de Capa 1:', vectorErr);
    }

    // ── Capa 2: Escalado a LLM si la Capa 1 no resolvió ─────────────────
    if (!replyText) {
        console.log('[AI_GENERATOR] Capa 1 sin coincidencias. Escalando a Capa 2 (LLMs)...');
        handledBy = 'llm';
        matchedIntent = 'llm_fallback';
        score = 0.0;

        let history: MessageHistory[] = [];
        if (senderPhone) {
            try {
                const supabase = await createClient();
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('phone_number', senderPhone)
                    .maybeSingle();
                
                if (conv) {
                    const { data: logs } = await supabase
                        .from('intent_logs')
                        .select('input_text, response_text')
                        .eq('conversation_id', conv.id)
                        .order('created_at', { ascending: false })
                        .limit(6);
                    
                    if (logs) {
                        history = logs.reverse().flatMap(log => {
                            const entries: MessageHistory[] = [];
                            if (log.input_text && log.input_text.trim() !== '') {
                                entries.push({ role: 'user', content: log.input_text });
                            }
                            if (log.response_text && log.response_text.trim() !== '') {
                                entries.push({ role: 'assistant', content: log.response_text });
                            }
                            return entries;
                        });
                    }
                }
            } catch (err) {
                console.error('[AI_GENERATOR] Error obteniendo historial para LLM:', err);
            }
        }

        const systemPrompt = await buildSystemPrompt();

        // Intentar Groq
        if (GROK_API_KEY) {
            try {
                console.log(`[AI_GENERATOR] Capa 2: Consumiendo Groq (${GROQ_MODEL})...`);
                replyText = await callGroq(GROK_API_KEY, systemPrompt, userMessage, history, senderPhone);
            } catch (groqErr) {
                console.error('[AI_GENERATOR] Groq falló:', groqErr);
            }
        }

        // Intentar Gemini (Fallback)
        if (!replyText && GEMINI_API_KEY) {
            try {
                console.log('[AI_GENERATOR] Capa 2: Consumiendo Gemini (gemini-1.5-flash) (fallback)...');
                replyText = await callGemini(GEMINI_API_KEY, systemPrompt, userMessage, history, senderPhone);
            } catch (geminiErr) {
                console.error('[AI_GENERATOR] Gemini falló:', geminiErr);
            }
        }

        // Fallback final
        if (!replyText) {
            console.warn('[AI_GENERATOR] Todas las capas de IA fallaron. Usando texto de contingencia.');
            replyText = `¡Hola! Gracias por comunicarte con Blue Ocean Paracas Tours. 🌊\nEn este momento nuestro sistema de respuesta automática está experimentando una alta demanda. Por favor, dinos en qué tour o alquiler estás interesado y un asesor humano te responderá a la brevedad.`;
        }
    }

    // ── Registrar Persistencia en Base de Datos ──────────────────────────
    if (senderPhone) {
        try {
            const supabase = await createClient();
            const latencyMs = Date.now() - startTime;

            let conversationId: string | null = null;
            const { data: conv, error: convError } = await supabase
                .from('conversations')
                .select('id, estado')
                .eq('phone_number', senderPhone)
                .maybeSingle();

            if (convError) {
                console.error('[SUPABASE_ERROR] Error fetching conversation:', convError);
                throw convError;
            }

            if (conv) {
                conversationId = conv.id;
            } else {
                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({ phone_number: senderPhone, estado: 'bot' })
                    .select('id')
                    .single();

                if (createError) {
                    console.error('[SUPABASE_ERROR] Error creating conversation:', createError);
                    throw createError;
                }

                if (newConv) {
                    conversationId = newConv.id;
                }
            }

            if (conversationId) {
                try {
                    console.log(`[AI_GENERATOR] Persistiendo interacción en intent_logs (Latencia: ${latencyMs}ms)...`);
                    const { error: logInsertError } = await supabase
                        .from('intent_logs')
                        .insert({
                            conversation_id: conversationId,
                            input_text: userMessage,
                            matched_intent: matchedIntent,
                            similarity_score: score,
                            handled_by: handledBy,
                            response_text: replyText,
                            latency_ms: latencyMs
                        });

                    if (logInsertError) {
                        console.error('[SUPABASE_ERROR] Error inserting intent log:', logInsertError);
                    }
                } catch (logErr) {
                    console.error('[AI_GENERATOR] Excepción al persistir intent log:', logErr);
                }
            }
        } catch (dbErr) {
            console.error('[AI_GENERATOR] Error crítico de persistencia en base de datos:', dbErr);
        }
    }

    return replyText;
}

