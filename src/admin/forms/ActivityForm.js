import React, { useState } from 'react';
import { Input, Textarea, TagsInput, Toggle, Button } from '../ui';
import { insertItem, updateItem } from '../../lib/api';

const empty = { title: '', organization: '', date: '', description: '', skills: [], visible: true };

const ActivityForm = ({ initial, onSaved, onCancel }) => {
  const [form, setForm] = useState(initial || empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (initial?.id) {
        const { id, created_at, order_index, ...patch } = form;
        await updateItem('activities', initial.id, patch);
      } else {
        await insertItem('activities', form);
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
      <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Edit activity' : 'New activity'}</h3>
      <Toggle checked={form.visible} onChange={set('visible')} label="Visible on site" />
      <div className="mt-3">
        <Input label="Title" value={form.title} onChange={set('title')} required />
        <Input label="Organization" value={form.organization} onChange={set('organization')} required />
        <Input label="Date" value={form.date} onChange={set('date')} required />
        <Textarea label="Description" value={form.description} onChange={set('description')} rows={6} />
        <TagsInput label="Skills" value={form.skills} onChange={set('skills')} />
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default ActivityForm;
