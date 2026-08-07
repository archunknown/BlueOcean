import { createClient } from '@/utils/supabase/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash';

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

/**
 * Call the Gemini model to generate a response.
 */
async function callGemini(systemInstruction: string, prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini LLM API error: ${JSON.stringify(errorData)}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('No content returned from Gemini LLM API.');
    }

    return text.trim();
}

/**
 * Generates an LLM response with custom context retrieval and handoff logic.
 */
export async function getLLMResponse(
    userMessage: string,
    conversationId: string,
    phoneNumber: string
): Promise<string> {
    const supabase = await createClient();

    // 1. Fetch context: Tours catalog
    const { data: tours } = await supabase
        .from('tours')
        .select('title, price, duration, category, short_description, time_slots')
        .eq('is_active', true);

    const tourContext = tours && tours.length > 0
        ? tours.map(t => 
            `- Tour: ${t.title}\n  Precio: S/ ${t.price}\n  Duración: ${t.duration}\n  Categoría: ${t.category}\n  Descripción: ${t.short_description}\n  Horarios: ${t.time_slots?.join(', ') || 'N/A'}`
          ).join('\n\n')
        : 'No hay información del catálogo disponible actualmente.';

    // 2. Fetch context: FAQs (generic fallback info)
    const { data: faqs } = await supabase
        .from('faq_embeddings')
        .select('pregunta, respuesta')
        .limit(5);

    const faqContext = faqs && faqs.length > 0
        ? faqs.map(f => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n')
        : 'No hay respuestas frecuentes de referencia.';

    const systemInstruction = `Eres el asistente de Inteligencia Artificial oficial de la empresa de turismo "Blue Ocean Paracas Tours".
Tu objetivo es responder de forma amable y natural basándote ÚNICAMENTE en el catálogo de tours y respuestas frecuentes de referencia proporcionados abajo.

=== CATÁLOGO DE TOURS ===
${tourContext}

=== RESPUESTAS FRECUENTES ===
${faqContext}

=== REGLAS ESTRICTAS DE RESPUESTA ===
1. Responde solo con información contenida en el catálogo de tours y respuestas frecuentes. Si te preguntan por información no provista, responde exactamente con la palabra "HANDOFF".
2. Está TERMINANTEMENTE PROHIBIDO calcular cotizaciones personalizadas, definir nuevos precios, aplicar descuentos arbitrarios o sugerir precios diferentes a los indicados en el catálogo.
3. Si el usuario solicita hablar con una persona, operador, recepcionista, solicita atención humana, o si la pregunta es muy compleja/fuera de contexto, responde exactamente con la palabra "HANDOFF".
4. Si la respuesta requiere una acción administrativa (como modificar una reserva existente, realizar reembolsos o validar cancelaciones), responde exactamente con la palabra "HANDOFF".
5. NO incluyas ninguna explicación, prefacio o despedida adicional si decides responder "HANDOFF". Responde solo esa palabra.`;

    try {
        const reply = await callGemini(systemInstruction, userMessage);

        if (reply.toUpperCase() === 'HANDOFF') {
            console.log(`[LLM_SERVICE] Activando Handoff para el número: ${phoneNumber}`);
            
            // Actualizar estado a atención humana
            const { error } = await supabase
                .from('conversations')
                .update({ estado: 'atencion_humana', updated_at: new Date().toISOString() })
                .eq('id', conversationId);

            if (error) {
                console.error('Error actualizando estado de conversación a atención humana:', error);
            }

            return `Transfiriendo tu consulta a un operador de la agencia. 📞 Un miembro del equipo te atenderá de forma manual por este canal en breve. ¡Muchas gracias por tu paciencia!`;
        }

        return reply;
    } catch (err) {
        console.error('❌ [LLM_SERVICE] Error generating LLM response:', err);
        return 'Disculpa la molestia, en este momento no puedo procesar tu solicitud. Si necesitas ayuda urgente, por favor solicita hablar con un asesor humano.';
    }
}
