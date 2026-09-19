import { useState } from 'react';

const StockInModal = ({ item, onCancel, onConfirm }) => {
  const [form, setForm] = useState({ quantity: '', unitCost: item?.unitCost || '', batchNumber: '', lotNumber: '', expirationDate: '', manufacturingDate: '', supplier: item?.supplier || '', referenceNumber: '', notes: '' });
  const [error, setError] = useState('');
  if (!item) return null;

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const submit = async () => {
    if (!form.quantity || form.quantity <= 0) { setError('Quantity must be positive'); return; }
    try {
      await onConfirm({ ...form, quantity: Number(form.quantity), unitCost: Number(form.unitCost) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stock in');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Stock In — {item.name}</h3>
        {error && <div className="alert alert-error text-sm py-2 mt-2">{error}</div>}
        <div className="space-y-3 mt-3">
          <div><label className="label-text text-sm">Quantity *</label><input type="number" className="input input-bordered w-full" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} /></div>
          <div><label className="label-text text-sm">Unit Cost</label><input type="number" className="input input-bordered w-full" value={form.unitCost} onChange={(e) => update('unitCost', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-text text-sm">Batch Number</label><input className="input input-bordered w-full" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} /></div>
            <div><label className="label-text text-sm">Lot Number</label><input className="input input-bordered w-full" value={form.lotNumber} onChange={(e) => update('lotNumber', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-text text-sm">Manufacturing Date</label><input type="date" className="input input-bordered w-full" value={form.manufacturingDate} onChange={(e) => update('manufacturingDate', e.target.value)} /></div>
            <div><label className="label-text text-sm">Expiration Date</label><input type="date" className="input input-bordered w-full" value={form.expirationDate} onChange={(e) => update('expirationDate', e.target.value)} /></div>
          </div>
          <div><label className="label-text text-sm">Supplier</label><input className="input input-bordered w-full" value={form.supplier} onChange={(e) => update('supplier', e.target.value)} /></div>
          <div><label className="label-text text-sm">Reference Number</label><input className="input input-bordered w-full" value={form.referenceNumber} onChange={(e) => update('referenceNumber', e.target.value)} /></div>
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Stock In</button>
        </div>
      </div>
    </div>
  );
};
export default StockInModal;