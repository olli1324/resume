import React, { useEffect, useState } from 'react';
import { Textarea, Toggle, Button, Card } from '../ui';
import { useSingleton } from '../../hooks/useContent';
import { updateSingleton } from '../../lib/api';

const AboutForm = () => {
  const { data, refresh } = useSingleton('about');
  const [form, setForm] = useState({ body: '', visible: true });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) setForm({ body: data.body || '', visible: data.visible });
  }, [data]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      await updateSingleton('about', { body: form.body, visible: form.visible });
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
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">About</h3>
          <Toggle
            checked={form.visible}
            onChange={(v) => setForm({ ...form, visible: v })}
            label="Visible on site"
          />
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Tip: lines starting with <code>- </code> render as bullet list.
        </p>
        <Textarea
          label="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={10}
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {msg && <p className="text-green-600 text-sm mb-2">{msg}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </Card>
  );
};

export default AboutForm;
