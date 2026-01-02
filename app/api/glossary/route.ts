import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all entries
export async function GET() {
  const { data, error } = await supabase
    .from('glossary_entries')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ entries: [] });
  }

  return NextResponse.json({ entries: data || [] });
}

// POST new entry
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('glossary_entries')
    .insert({
      title: body.title,
      description: body.description,
      rules: body.rules || [],
      formula: body.formula || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }

  // Record in changelog
  await supabase.from('glossary_changelog').insert({
    entry_id: data.id,
    entry_title: data.title,
    action: 'CREATE',
    new_data: data,
  });

  return NextResponse.json(data, { status: 201 });
}

// PUT update entry
export async function PUT(request: NextRequest) {
  const body = await request.json();

  // Get old data for changelog
  const { data: oldData } = await supabase
    .from('glossary_entries')
    .select('*')
    .eq('id', body.id)
    .single();

  const { data, error } = await supabase
    .from('glossary_entries')
    .update({
      title: body.title,
      description: body.description,
      rules: body.rules || [],
      formula: body.formula || null,
    })
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }

  // Record in changelog
  await supabase.from('glossary_changelog').insert({
    entry_id: data.id,
    entry_title: data.title,
    action: 'UPDATE',
    old_data: oldData,
    new_data: data,
  });

  return NextResponse.json(data);
}

// DELETE entry
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  // Get old data for changelog before deletion
  const { data: oldData } = await supabase
    .from('glossary_entries')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('glossary_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }

  // Record in changelog
  if (oldData) {
    await supabase.from('glossary_changelog').insert({
      entry_id: id,
      entry_title: oldData.title,
      action: 'DELETE',
      old_data: oldData,
    });
  }

  return NextResponse.json({ success: true });
}
