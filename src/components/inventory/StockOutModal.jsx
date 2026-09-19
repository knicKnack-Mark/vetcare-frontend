import { useState } from 'react';

const StockOutModal = ({ item, onCancel, onConfirm }) => {
  const [form, setForm] = useState({ quantity: '', transactionType: 'usage', reason: '', notes: '' });
  const [error, setError] = useState('');
  if (!item) return null;

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));
  const qty = Number(form.quantity) || 0;

  const submit = async () => {
    if (!form.quantity || qty <= 0) { setError('Quantity must be positive'); return; }
    if (qty > item.quantityRemaining) { setError(`Only ${item.quantityRemaining} available`); return; }
    try {
      await onConfirm({ ...form, quantity: qty });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stock out');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Stock Out — {item.name}</h3>
        <p className="text-sm opacity-60 mt-1">Available: {item.quantityRemaining} {item.unit}</p>
        {error && <div className="alert alert-error text-sm py-2 mt-2">{error}</div>}
        <div className="space-y-3 mt-3">
          <div><label className="label-text text-sm">Quantity to Remove *</label><input type="number" className="input input-bordered w-full" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} /></div>
          {qty > 0 && qty <= item.quantityRemaining && <p className="text-xs opacity-60">Remaining after: {item.quantityRemaining - qty}</p>}
          <div><label className="label-text text-sm">Transaction Type</label>
            <select className="select select-bordered w-full" value={form.transactionType} onChange={(e) => update('transactionType', e.target.value)}>
              {['usage', 'sale', 'damaged', 'expired', 'returned', 'transfer'].map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Reason</label><input className="input input-bordered w-full" value={form.reason} onChange={(e) => update('reason', e.target.value)} /></div>
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error" onClick={submit}>Stock Out</button>
        </div>
      </div>
    </div>
  );
};
export default StockOutModal;