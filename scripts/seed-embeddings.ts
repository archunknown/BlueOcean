/**
 * Script de actualización masiva de embeddings para la tabla faq_embeddings.
 *
 * Uso: npx tsx scripts/seed-embeddings.ts
 *
 * Requiere las siguientes variables de entorno (vía .env.local o export):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GEMINI_API_KEY
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde .env
config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Config ──────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}
if (!GEMINI_API_KEY) {
    console.error('❌ Falta GEMINI_API_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Embedding ───────────────────────────────────────────────────────────
async function getEmbedding(text: string): Promise<number[]> {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent({
        content: { role: 'user', parts: [{ text }] },
        outputDimensionality: 768,
    } as Parameters<typeof model.embedContent>[0]);
    return result.embedding.values;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔄 Obteniendo registros de faq_embeddings...');

    const { data: faqs, error } = await supabase
        .from('faq_embeddings')
        .select('id, pregunta, respuesta');

    if (error) {
        console.error('❌ Error al leer faq_embeddings:', error);
        process.exit(1);
    }

    if (!faqs || faqs.length === 0) {
        console.log('⚠️  No se encontraron FAQs en la tabla.');
        return;
    }

    console.log(`📋 ${faqs.length} FAQs encontradas. Generando embeddings...\n`);

    let success = 0;
    let failed = 0;

    for (const faq of faqs) {
        const combinedText = `${faq.pregunta}\n${faq.respuesta}`;
        try {
            const embedding = await getEmbedding(combinedText);
            console.log(`  ✅ [${faq.id}] Vector generado (${embedding.length} dims) — "${faq.pregunta.substring(0, 60)}..."`);

            const { error: updateError } = await supabase
                .from('faq_embeddings')
                .update({ embedding: embedding as unknown as number[] })
                .eq('id', faq.id);

            if (updateError) {
                console.error(`  ❌ [${faq.id}] Error al actualizar en DB:`, updateError);
                failed++;
            } else {
                success++;
            }
        } catch (err) {
            console.error(`  ❌ [${faq.id}] Error al generar embedding:`, err);
            failed++;
        }

        // Rate limit: 100ms entre llamadas para evitar throttling de la API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n🏁 Finalizado. Éxito: ${success} | Fallos: ${failed} | Total: ${faqs.length}`);
}

main().catch((err) => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
});
