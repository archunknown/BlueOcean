import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * API Route para obtener las métricas del chatbot.
 * Utiliza SUPABASE_SERVICE_ROLE_KEY para bypass de RLS.
 */
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json(
                { error: 'Missing Supabase configuration' },
                { status: 500 }
            );
        }

        const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

        // 1. Fetch recent intent logs with conversation join
        const { data: recentLogs, error: logsError } = await supabase
            .from('intent_logs')
            .select('id, input_text, matched_intent, similarity_score, handled_by, response_text, latency_ms, created_at, conversations:conversation_id(phone_number, estado)')
            .order('created_at', { ascending: false })
            .limit(100);

        if (logsError) {
            console.error('[METRICS_API] Error fetching recent logs:', logsError);
            return NextResponse.json({ error: logsError.message }, { status: 500 });
        }

        // 2. Fetch all logs for stats computation
        const { data: allLogs, error: countError } = await supabase
            .from('intent_logs')
            .select('handled_by, similarity_score');

        if (countError) {
            console.error('[METRICS_API] Error fetching all logs:', countError);
            return NextResponse.json({ error: countError.message }, { status: 500 });
        }

        // 3. Conversation handoff stats
        const { count: handoffs } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'atencion_humana');

        const { count: totalConv } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true });

        // 4. Compute stats
        const total = allLogs?.length || 0;
        const pgv = allLogs?.filter(l => l.handled_by === 'pgvector').length || 0;
        const llm = allLogs?.filter(l => l.handled_by === 'llm').length || 0;

        const pgvScores = allLogs?.filter(l => l.handled_by === 'pgvector' && l.similarity_score !== null) || [];
        const avgSim = pgvScores.length > 0
            ? pgvScores.reduce((acc, curr) => acc + (curr.similarity_score || 0), 0) / pgvScores.length
            : 0;

        const pgvPct = total > 0 ? Math.round((pgv / total) * 100) : 0;
        const llmPct = total > 0 ? Math.round((llm / total) * 100) : 0;

        const handoffCount = handoffs || 0;
        const totalSessions = totalConv || 1;
        const handoffPct = totalSessions > 0 ? Math.round((handoffCount / totalSessions) * 100) : 0;
        const resolutionPct = 100 - handoffPct;

        return NextResponse.json({
            logs: recentLogs || [],
            stats: {
                totalMessages: total,
                pgvectorCount: pgv,
                llmCount: llm,
                pgvectorPercentage: pgvPct,
                llmPercentage: llmPct,
                avgSimilarity: parseFloat(avgSim.toFixed(4)),
                handoffCount,
                handoffPercentage: handoffPct,
                resolutionPercentage: resolutionPct,
            },
        });
    } catch (err) {
        console.error('[METRICS_API] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
