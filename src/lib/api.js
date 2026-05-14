import { supabase } from './supabase';

export async function listOrdered(table, { onlyVisible = false } = {}) {
  let q = supabase.from(table).select('*').order('order_index', { ascending: true });
  if (onlyVisible) q = q.eq('visible', true);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getSingleton(table) {
  const { data, error } = await supabase.from(table).select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSingleton(table, patch) {
  const { error } = await supabase.from(table).update(patch).eq('id', 1);
  if (error) throw error;
}

export async function listSections({ onlyVisible = false } = {}) {
  let q = supabase.from('sections').select('*').order('order_index', { ascending: true });
  if (onlyVisible) q = q.eq('visible', true);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function upsertSection(section) {
  const { error } = await supabase.from('sections').upsert(section);
  if (error) throw error;
}

export async function insertItem(table, item) {
  const { data: existing } = await supabase
    .from(table)
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1);
  const nextIndex = existing && existing.length > 0 ? (existing[0].order_index || 0) + 1 : 0;
  const { data, error } = await supabase
    .from(table)
    .insert({ ...item, order_index: nextIndex })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateItem(table, id, patch) {
  const { error } = await supabase.from(table).update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteItem(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function toggleVisible(table, id, visible) {
  return updateItem(table, id, { visible });
}

export async function swapOrder(table, a, b) {
  await Promise.all([
    updateItem(table, a.id, { order_index: b.order_index }),
    updateItem(table, b.id, { order_index: a.order_index }),
  ]);
}

export async function moveItem(table, items, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return;
  const a = items[index];
  const b = items[target];
  if (a.order_index === b.order_index) {
    await updateItem(table, b.id, { order_index: (b.order_index || 0) + direction });
  } else {
    await swapOrder(table, a, b);
  }
}

export async function uploadFile(file, { bucket = 'project-images' } = {}) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProjectImage(file) {
  return uploadFile(file);
}

export async function uploadCv(file) {
  return uploadFile(file);
}
