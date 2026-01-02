import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    let query = supabase
        .from('glossary_changelog')
        .select('*')
        .order('created_at', { ascending: false });

    if (entryId) {
        query = query.eq('entry_id', entryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching changelog:', error);
        return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: data || [] });
}
