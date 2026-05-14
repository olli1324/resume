import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Toggle } from '../ui';
import { useSingleton } from '../../hooks/useContent';
import { updateSingleton, uploadProjectImage, uploadCv } from '../../lib/api';

const ProfileForm = () => {
  const { data, refresh } = useSingleton('profile');
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProjectImage(file);
      setForm((f) => ({ ...f, profile_image_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onUploadCv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    setError(null);
    try {
      const url = await uploadCv(file);
      setForm((f) => ({ ...f, cv_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCv(false);
      e.target.value = '';
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const { id, ...patch } = form;
      await updateSingleton('profile', patch);
      setMsg('Saved!');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <form onSubmit={save}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile / Hero</h3>

        <div className="flex items-center gap-4 mb-4">
          {form.profile_image_url && (
            <img src={form.profile_image_url} alt="" className="w-20 h-20 rounded-full object-cover" />
          )}
          <div>
            <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} className="text-sm" />
            {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
          </div>
        </div>

        <Input label="Name" value={form.name || ''} onChange={set('name')} />
        <Input label="Tagline" value={form.tagline || ''} onChange={set('tagline')} />
        <Input label="Phone" value={form.phone || ''} onChange={set('phone')} placeholder="+47..." />
        <Input label="Email" type="email" value={form.email || ''} onChange={set('email')} />
        <Input label="GitHub URL" type="url" value={form.github_url || ''} onChange={set('github_url')} />
        <Input label="LinkedIn URL" type="url" value={form.linkedin_url || ''} onChange={set('linkedin_url')} />

        <div className="mb-4 pt-3 border-t border-gray-200">
          <span className="block text-sm font-medium text-gray-700 mb-2">CV (PDF)</span>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <input
              type="file"
              accept="application/pdf"
              onChange={onUploadCv}
              disabled={uploadingCv}
              className="text-sm"
            />
            {uploadingCv && <span className="text-sm text-gray-500">Uploading…</span>}
            {form.cv_url && (
              <a
                href={form.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 underline"
              >
                View current CV
              </a>
            )}
          </div>
          <Toggle
            checked={form.cv_enabled}
            onChange={(v) => setForm((f) => ({ ...f, cv_enabled: v }))}
            label="Show download button on site"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {msg && <p className="text-green-600 text-sm mb-2">{msg}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={busy || uploading || uploadingCv}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;
