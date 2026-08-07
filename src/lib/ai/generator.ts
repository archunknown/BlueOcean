import { createClient } from '@/utils/supabase/server';
import { matchFAQ } from '@/services/faq-service';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROK_API_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `Eres el asistente oficial de Inteligencia Artificial de "Blue Ocean Paracas Tours", una agencia de turismo líder en Paracas, Perú.
Tu objetivo es guiar de forma amable, clara y servicial a los turistas que consultan sobre nuestros tours, alquileres y servicios de asistencia.

Aquí tienes información detallada de nuestros servicios para responder con precisión:

=== CATÁLOGO DE TOURS ===
1. **Islas Ballestas (Tour)**
   - Precio: S/ 40 por persona.
   - Duración: 2 horas.
   - Detalle: Navegación en modernos deslizadores seguros (capacidad 40-50 pax). Observación del Candelabro, formaciones rocosas y avistamiento de lobos marinos, pingüinos de Humboldt y aves guaneras.
   - Horarios de Salida: 8:00 AM, 10:00 AM y 12:00 PM.

2. **Reserva Nacional en Auto (Tour)**
   - Precio: S/ 90 por persona (servicio privado).
   - Duración: Aprox. 4 horas.
   - Detalle: Recorrido privado por el desierto y playas hermosas (Mirador Istmo, Playa Roja, Playa La Mina, y Playa Lagunillas).
   - Horarios de Salida: Flexibles a acordar con el cliente.

3. **Mini Buggies Arenacross (Tour Aventura)**
   - Precio: S/ 100 por vehículo (1 o 2 personas).
   - Duración: 2 horas (recorrido guiado de 20 km).
   - Detalle: Conduce tu propio buggy por la Reserva. Visita Playa Yumaque, Mirador Istmo y Playa Roja.
   - Horarios de Acceso: Salidas cada hora entre 9:00 AM y 3:00 PM.

=== CATÁLOGO DE ALQUILERES ===
4. **Alquiler de Moto Scooter**
   - Precio: S/ 80 (día completo).
   - Horario: 9:00 AM a 5:00 PM.
   - Incluye: Scooter moderna, cascos, mapa de la reserva y asistencia en ruta.

5. **Alquiler de Bicicleta**
   - Precio: S/ 25 (día completo).
   - Horario: 9:00 AM a 5:00 PM.
   - Incluye: Bicicleta de montaña, casco, mapa de rutas y kit de herramientas básico.

=== REGLAS IMPORTANTES ===
- **Pagos Online**: Se realizan únicamente a través de la pasarela segura MercadoPago (con confirmación automática vía webhook).
- **Pagos Presenciales**: Se pueden realizar en la agencia en efectivo o mediante Yape/Transferencia. La reserva se mantendrá "PENDIENTE" hasta que nuestro personal valide el cobro en el panel de control.
- **Custodia Gratuita**: Ofrecemos almacenamiento logístico temporal de equipaje y mascotas para todos nuestros clientes de forma gratuita mientras realizan sus actividades.
- **Tono**: Amable, profesional y acogedor. Si el usuario solicita hablar con un humano o si no sabes la respuesta a una pregunta muy específica de reservas existentes, indícalo de forma atenta indicando que derivarás su consulta al personal.
- **Precios**: Respeta estrictamente los precios listados. No ofrezcas descuentos sin autorización ni inventes tarifas adicionales.
`;

/**
 * Generates an AI response using the Gemini API.
 */
async function callGemini(apiKey: string, userMessage: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [
            {
                parts: [{ text: userMessage }]
            }
        ],
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
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
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
        throw new Error('No candidate content returned from Gemini.');
    }
    return reply.trim();
}

/**
 * Generates an AI response using the Groq API.
 */
async function callGroq(apiKey: string, userMessage: string): Promise<string> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const payload = {
        model: 'llama-3.1-8b-instant',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
        ],
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
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
        throw new Error('No completion returned from Groq.');
    }
    return reply.trim();
}

/**
 * Generates an AI response based on the user's message.
 * 
 * Capa 1: Búsqueda vectorial semántica en Supabase con pgvector (umbral >= 0.80).
 * Capa 2: Escalado a LLM (Groq con llama-3.1-8b-instant primero; Gemini 1.5 Flash como fallback).
 * 
 * Si se provee `senderPhone`, gestiona la sesión e inserta la interacción en `intent_logs`.
 */
export async function generateAIResponse(userMessage: string, senderPhone?: string): Promise<string> {
    const startTime = Date.now();
    let replyText = '';
    let handledBy: 'pgvector' | 'llm' = 'pgvector';
    let matchedIntent: string | null = null;
    let score: number | null = null;

    // 1. Capa 1 - Similitud Vectorial Semántica (Supabase pgvector)
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

    // 2. Capa 2 - Escalado a LLM si la Capa 1 no resolvió
    if (!replyText) {
        console.log('[AI_GENERATOR] Capa 1 sin coincidencias. Escalando a Capa 2 (LLMs)...');
        handledBy = 'llm';
        matchedIntent = 'llm_fallback';
        score = 0.0;

        // Intentar Groq
        if (GROK_API_KEY) {
            try {
                console.log('[AI_GENERATOR] Capa 2: Consumiendo Groq (llama-3.1-8b-instant)...');
                replyText = await callGroq(GROK_API_KEY, userMessage);
            } catch (groqErr) {
                console.error('[AI_GENERATOR] Groq falló:', groqErr);
            }
        }

        // Intentar Gemini (Fallback)
        if (!replyText && GEMINI_API_KEY) {
            try {
                console.log('[AI_GENERATOR] Capa 2: Consumiendo Gemini (gemini-1.5-flash) (fallback)...');
                replyText = await callGemini(GEMINI_API_KEY, userMessage);
            } catch (geminiErr) {
                console.error('[AI_GENERATOR] Gemini falló:', geminiErr);
            }
        }

        // Fallback final en caso de que todo falle
        if (!replyText) {
            console.warn('[AI_GENERATOR] Todas las capas de IA fallaron. Usando texto de contingencia.');
            replyText = `¡Hola! Gracias por comunicarte con Blue Ocean Paracas Tours. 🌊\nEn este momento nuestro sistema de respuesta automática está experimentando una alta demanda. Por favor, dinos en qué tour o alquiler estás interesado y un asesor humano te responderá a la brevedad.`;
        }
    }

    // 3. Registrar Persistencia en Base de Datos
    if (senderPhone) {
        try {
            const supabase = await createClient();
            const latencyMs = Date.now() - startTime;

            // Obtener conversación
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
                // Crear conversación si no existe
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
