import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface FAQMatchResult {
    id: string;
    pregunta: string;
    respuesta: string;
    categoria: string | null;
    similarity: number;
}

/**
 * Generates an embedding vector using Gemini's gemini-embedding-001 model via the official SDK.
 */
export async function getGeminiEmbedding(text: string): Promise<number[] | null> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('❌ [FAQ_SERVICE] GEMINI_API_KEY environment variable is not defined.');
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const result = await model.embedContent({
            content: { role: 'user', parts: [{ text }] },
            outputDimensionality: 768,
        } as Parameters<typeof model.embedContent>[0]);
        return result.embedding.values;
    } catch (err) {
        console.error('❌ [FAQ_SERVICE] Error generating embedding via gemini-embedding-001:', err);
        return null;
    }
}

/**
 * Matches a query string against the vector database of FAQs.
 */
export async function matchFAQ(text: string, threshold: number = 0.80, limit: number = 3): Promise<FAQMatchResult[]> {
    try {
        const embedding = await getGeminiEmbedding(text);
        if (!embedding) {
            console.warn('⚠️ [FAQ_SERVICE] Embedding failed (null). Skipping Capa 1 matching.');
            return [];
        }

        const supabase = await createClient();

        // Convert the number array to pgvector string representation: [val1,val2,...]
        const query_embedding = `[${embedding.join(',')}]`;

        const { data, error } = await supabase.rpc('match_faq', {
            query_embedding,
            match_threshold: threshold,
            match_count: limit,
        });

        if (error) {
            console.error('❌ [FAQ_SERVICE] RPC match_faq failed:', error);
            return [];
        }

        return (data || []) as FAQMatchResult[];
    } catch (err) {
        console.error('❌ [FAQ_SERVICE] Error matching FAQs:', err);
        return [];
    }
}
