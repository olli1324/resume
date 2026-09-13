// Content API backed by the site's own Cloudflare Functions (D1 + R2).
// The exported functions keep the signatures they had when this talked to
// Supabase, so the admin forms and public components did not need to change.

async function request(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: form || (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error((data && data.feil) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const enc = encodeURIComponent;

export async function listOrdered(table, { onlyVisible = false } = {}) {
  return (await request(`/api/innhold/${enc(table)}${onlyVisible ? '?synlige=1' : ''}`)) || [];
}

export async function getSingleton(table) {
  return request(`/api/innhold/${enc(table)}/1`);
}

export async function updateSingleton(table, patch) {
  await request(`/api/admin/${enc(table)}/1`, { method: 'PATCH', body: patch });
}

export async function listSections({ onlyVisible = false } = {}) {
  return listOrdered('sections', { onlyVisible });
}

export async function upsertSection(section) {
  await request(`/api/admin/sections/${enc(section.key)}`, { method: 'PUT', body: section });
}

export async function insertItem(table, item) {
  return request(`/api/admin/${enc(table)}`, { method: 'POST', body: item });
}

export async function updateItem(table, id, patch) {
  await request(`/api/admin/${enc(table)}/${enc(id)}`, { method: 'PATCH', body: patch });
}

export async function deleteItem(table, id) {
  await request(`/api/admin/${enc(table)}/${enc(id)}`, { method: 'DELETE' });
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

export async function uploadFile(file) {
  const form = new FormData();
  form.append('fil', file);
  const { url } = await request('/api/admin/fil', { method: 'POST', form });
  return url;
}

export async function uploadProjectImage(file) {
  return uploadFile(file);
}

export async function uploadCv(file) {
  return uploadFile(file);
}

// Admin session. The password never touches the browser's JS beyond the login
// request; the session itself lives in an HttpOnly cookie set by the server.
export async function getAdminSession() {
  try {
    await request('/api/admin/meg');
    return true;
  } catch {
    return false;
  }
}

export async function adminLogin(password) {
  await request('/api/login', { method: 'POST', body: { område: 'admin', passord: password } });
}

export async function adminLogout() {
  await request('/api/logout', { method: 'POST', body: { område: 'admin' } });
}
