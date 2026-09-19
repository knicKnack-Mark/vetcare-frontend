import { useState } from 'react';

const AdjustStockModal = ({ item, onCancel, onConfirm }) => {
  const [quantity, setQuantity] = useState(item?.quantityRemaining ?? 0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  if (!item) return null;

  const difference = Number(quantity) - item.quantityRemaining;

  const submit = async () => {
    if (!reason) { setError('Reason is required'); return; }
    try {
      await onConfirm({ quantity: Number(quantity), reason, notes });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust stock');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Adjust Stock — {item.name}</h3>
        <p className="text-sm opacity-60 mt-1">Current: {item.quantityRemaining} {item.unit}</p>
        {error && <div className="alert alert-error text-sm py-2 mt-2">{error}</div>}
        <div className="space-y-3 mt-3">
          <div><label className="label-text text-sm">Actual Quantity *</label><input type="number" className="input input-bordered w-full" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
          <p className="text-xs opacity-60">Difference: {difference > 0 ? '+' : ''}{difference}</p>
          <div><label className="label-text text-sm">Reason *</label><input className="input input-bordered w-full" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Physical count adjustment" /></div>
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-warning" onClick={submit}>Save Adjustment</button>
        </div>
      </div>
    </div>
  );
};
export default AdjustStockModal;