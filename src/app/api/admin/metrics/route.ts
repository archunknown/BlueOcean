import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { getUserRole } from '@/utils/roles';

/**
 * API Route para obtener las métricas del chatbot.
 * Utiliza SUPABASE_SERVICE_ROLE_KEY para bypass de RLS.
 */
export async function GET() {
    try {
        const role = await getUserRole();
        if (role !== 'developer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
        }

        const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

        // 1. Recent logs with conversation join
        const { data: recentLogs, error: logsError } = await supabase
            .from('intent_logs')
            .select('id, input_text, matched_intent, similarity_score, handled_by, response_text, latency_ms, created_at, conversations:conversation_id(phone_number, estado)')
            .order('created_at', { ascending: false })
            .limit(100);

        if (logsError) {
            console.error('[METRICS_API] Error fetching recent logs:', logsError);
            return NextResponse.json({ error: logsError.message }, { status: 500 });
        }

        // 2. All logs for stats
        const { data: allLogs, error: countError } = await supabase
            .from('intent_logs')
            .select('handled_by, similarity_score, latency_ms, created_at')
            .order('created_at', { ascending: true });

        if (countError) {
            console.error('[METRICS_API] Error fetching all logs:', countError);
            return NextResponse.json({ error: countError.message }, { status: 500 });
        }

        // 3. Conversation stats
        const { count: handoffs } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'atencion_humana');

        const { count: totalConv } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true });

        // 4. Global stats computation
        const total = allLogs?.length || 0;
        const pgv = allLogs?.filter(l => l.handled_by === 'pgvector').length || 0;
        const llm = allLogs?.filter(l => l.handled_by === 'llm').length || 0;

        const pgvScores = allLogs?.filter(l => l.handled_by === 'pgvector' && l.similarity_score !== null) || [];
        const avgSim = pgvScores.length > 0
            ? pgvScores.reduce((acc, curr) => acc + (curr.similarity_score || 0), 0) / pgvScores.length
            : 0;

        const latencies = allLogs?.filter(l => l.latency_ms !== null && l.latency_ms !== undefined && (l.latency_ms as number) > 0) || [];
        const avgLatency = latencies.length > 0
            ? Math.round(latencies.reduce((acc, curr) => acc + (curr.latency_ms as number || 0), 0) / latencies.length)
            : 0;

        const pgvPct = total > 0 ? Math.round((pgv / total) * 100) : 0;
        const llmPct = total > 0 ? Math.round((llm / total) * 100) : 0;
        const handoffCount = handoffs || 0;
        const totalSessions = totalConv || 1;
        const handoffPct = totalSessions > 0 ? Math.round((handoffCount / totalSessions) * 100) : 0;
        const resolutionPct = 100 - handoffPct;

        // 5. Daily time-series last 14 days
        const last14Days: string[] = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last14Days.push(d.toISOString().slice(0, 10));
        }

        const dailyMap: Record<string, { date: string; pgvector: number; llm: number; total: number }> = {};
        last14Days.forEach(date => {
            dailyMap[date] = { date, pgvector: 0, llm: 0, total: 0 };
        });

        allLogs?.forEach(log => {
            const date = log.created_at?.slice(0, 10);
            if (date && dailyMap[date]) {
                dailyMap[date].total++;
                if (log.handled_by === 'pgvector') dailyMap[date].pgvector++;
                else if (log.handled_by === 'llm') dailyMap[date].llm++;
            }
        });

        const dailyData = Object.values(dailyMap).map(d => ({
            ...d,
            date: new Date(d.date + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
        }));

        // 6. Similarity score distribution buckets
        const simBuckets = [
            { range: '< 0.60', count: 0 },
            { range: '0.60–0.70', count: 0 },
            { range: '0.70–0.80', count: 0 },
            { range: '0.80–0.90', count: 0 },
            { range: '≥ 0.90', count: 0 },
        ];
        pgvScores.forEach(l => {
            const s = l.similarity_score || 0;
            if (s < 0.60) simBuckets[0].count++;
            else if (s < 0.70) simBuckets[1].count++;
            else if (s < 0.80) simBuckets[2].count++;
            else if (s < 0.90) simBuckets[3].count++;
            else simBuckets[4].count++;
        });

        return NextResponse.json({
            logs: recentLogs || [],
            stats: {
                totalMessages: total,
                pgvectorCount: pgv,
                llmCount: llm,
                pgvectorPercentage: pgvPct,
                llmPercentage: llmPct,
                avgSimilarity: parseFloat(avgSim.toFixed(4)),
                avgLatencyMs: avgLatency,
                handoffCount,
                handoffPercentage: handoffPct,
                resolutionPercentage: resolutionPct,
                totalSessions: totalConv || 0,
            },
            dailyData,
            simBuckets,
        });
    } catch (err) {
        console.error('[METRICS_API] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
