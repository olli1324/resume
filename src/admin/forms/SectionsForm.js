import React, { useState } from 'react';
import { Toggle, Button, Card } from '../ui';
import { useSections } from '../../hooks/useContent';
import { upsertSection } from '../../lib/api';

const SectionsForm = () => {
  const { sections, refresh } = useSections();
  const [busyId, setBusyId] = useState(null);

  const onToggle = async (s, v) => {
    setBusyId(s.key);
    await upsertSection({ ...s, visible: v });
    await refresh();
    setBusyId(null);
  };

  const onMove = async (i, dir) => {
    const target = i + dir;
    if (target < 0 || target >= sections.length) return;
    const a = sections[i];
    const b = sections[target];
    setBusyId(a.key);
    if (a.order_index === b.order_index) {
      await upsertSection({ ...b, order_index: (b.order_index || 0) + dir });
    } else {
      await Promise.all([
        upsertSection({ ...a, order_index: b.order_index }),
        upsertSection({ ...b, order_index: a.order_index }),
      ]);
    }
    await refresh();
    setBusyId(null);
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Sections</h3>
      <p className="text-sm text-gray-500 mb-4">
        Toggle whole sections on/off, or reorder them on your homepage.
      </p>
      <div className="space-y-2">
        {sections.map((s, i) => (
          <div
            key={s.key}
            className={`flex items-center justify-between border border-gray-200 rounded px-3 py-2 ${s.visible ? '' : 'opacity-60'}`}
          >
            <div>
              <div className="font-medium text-gray-800">{s.title}</div>
              <div className="text-xs text-gray-500">{s.key}</div>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked={s.visible} onChange={(v) => onToggle(s, v)} label={s.visible ? 'On' : 'Off'} />
              <Button variant="ghost" onClick={() => onMove(i, -1)} disabled={i === 0 || busyId === s.key}>↑</Button>
              <Button variant="ghost" onClick={() => onMove(i, 1)} disabled={i === sections.length - 1 || busyId === s.key}>↓</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SectionsForm;
