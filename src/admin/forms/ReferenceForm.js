import React, { useState } from 'react';
import { Input, Textarea, Toggle, Button } from '../ui';
import { insertItem, updateItem } from '../../lib/api';

const empty = { name: '', title: '', contact: '', body: '', visible: true };

const ReferenceForm = ({ initial, onSaved, onCancel }) => {
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
        await updateItem('references', initial.id, patch);
      } else {
        await insertItem('references', form);
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
      <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Edit reference' : 'New reference'}</h3>
      <Toggle checked={form.visible} onChange={set('visible')} label="Visible on site" />
      <div className="mt-3">
        <Input label="Name" value={form.name} onChange={set('name')} required />
        <Input label="Title / Role" value={form.title || ''} onChange={set('title')} />
        <Input label="Contact (email or phone)" value={form.contact || ''} onChange={set('contact')} />
        <Textarea label="Notes / quote" value={form.body || ''} onChange={set('body')} rows={4} />
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default ReferenceForm;
