import React, { useState } from 'react';
import { Toggle, Button, Card } from './ui';
import { useList } from '../hooks/useContent';
import { deleteItem, moveItem, toggleVisible } from '../lib/api';

const ItemList = ({ table, renderSummary, FormComponent }) => {
  const { items, refresh } = useList(table);
  const [editing, setEditing] = useState(null); // 'new' | id
  const [busyId, setBusyId] = useState(null);

  const onMove = async (i, dir) => {
    setBusyId(items[i].id);
    await moveItem(table, items, i, dir);
    await refresh();
    setBusyId(null);
  };

  const onToggle = async (item, visible) => {
    setBusyId(item.id);
    await toggleVisible(table, item.id, visible);
    await refresh();
    setBusyId(null);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setBusyId(id);
    await deleteItem(table, id);
    await refresh();
    setBusyId(null);
  };

  const editingItem =
    editing && editing !== 'new' ? items.find((i) => i.id === editing) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Items ({items.length})</h3>
        <Button onClick={() => setEditing('new')}>+ Add new</Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <FormComponent
            initial={editingItem}
            onSaved={async () => {
              setEditing(null);
              await refresh();
            }}
            onCancel={() => setEditing(null)}
          />
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <Card key={item.id} className={item.visible ? '' : 'opacity-60'}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">{renderSummary(item)}</div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Toggle
                  checked={item.visible}
                  onChange={(v) => onToggle(item, v)}
                  label={item.visible ? 'Visible' : 'Hidden'}
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => onMove(i, -1)}
                    disabled={i === 0 || busyId === item.id}
                    title="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onMove(i, 1)}
                    disabled={i === items.length - 1 || busyId === item.id}
                    title="Move down"
                  >
                    ↓
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(item.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-8">No items yet. Click "Add new" to start.</p>
        )}
      </div>
    </div>
  );
};

export default ItemList;
