import React, { useState } from 'react';
import { Input, Textarea, TagsInput, Toggle, Button } from '../ui';
import { insertItem, updateItem, uploadProjectImage } from '../../lib/api';

const empty = {
  title: '',
  description: '',
  date: '',
  live_url: '',
  repo_url: '',
  tech_stack: [],
  image_urls: [],
  featured: false,
  visible: true,
};

const ProjectForm = ({ initial, onSaved, onCancel }) => {
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map(uploadProjectImage));
      setForm((f) => ({ ...f, image_urls: [...(f.image_urls || []), ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url) => {
    setForm((f) => ({ ...f, image_urls: f.image_urls.filter((u) => u !== url) }));
  };

  const moveImage = (i, dir) => {
    const target = i + dir;
    if (target < 0 || target >= form.image_urls.length) return;
    const next = [...form.image_urls];
    [next[i], next[target]] = [next[target], next[i]];
    setForm({ ...form, image_urls: next });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (initial?.id) {
        const { id, created_at, order_index, ...patch } = form;
        await updateItem('projects', initial.id, patch);
      } else {
        await insertItem('projects', form);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Edit project' : 'New project'}</h3>
      <div className="flex gap-6 mb-3">
        <Toggle checked={form.visible} onChange={set('visible')} label="Visible on site" />
        <Toggle checked={form.featured} onChange={set('featured')} label="Featured (highlighted)" />
      </div>
      <Input label="Title" value={form.title} onChange={set('title')} required />
      <Input label="Date (e.g., 2024 or Jan 2024)" value={form.date || ''} onChange={set('date')} />
      <Textarea label="Description" value={form.description} onChange={set('description')} rows={5} />
      <Input label="Live URL" type="url" value={form.live_url || ''} onChange={set('live_url')} placeholder="https://…" />
      <Input label="Repo URL" type="url" value={form.repo_url || ''} onChange={set('repo_url')} placeholder="https://github.com/…" />
      <TagsInput label="Tech stack" value={form.tech_stack || []} onChange={set('tech_stack')} placeholder="e.g., React" />

      <div className="mb-3">
        <span className="block text-sm font-medium text-gray-700 mb-1">Images</span>
        {form.image_urls && form.image_urls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {form.image_urls.map((url, i) => (
              <div key={url} className="relative group">
                <img src={url} alt="" className="w-full h-32 object-cover rounded" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1">
                  <Button type="button" variant="secondary" onClick={() => moveImage(i, -1)} disabled={i === 0}>←</Button>
                  <Button type="button" variant="secondary" onClick={() => moveImage(i, 1)} disabled={i === form.image_urls.length - 1}>→</Button>
                  <Button type="button" variant="danger" onClick={() => removeImage(url)}>×</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <input type="file" accept="image/*" multiple onChange={onUpload} disabled={uploading} className="text-sm" />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading…</p>}
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={busy || uploading}>{busy ? 'Saving…' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default ProjectForm;
