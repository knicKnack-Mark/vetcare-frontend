import { useState } from 'react';

const RefundModal = ({ billing, onCancel, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  if (!billing) return null;

  const submit = async () => {
    if (!amount || amount <= 0) { setError('Refund amount must be greater than zero'); return; }
    if (Number(amount) > billing.amountPaid) { setError(`Cannot exceed amount paid (₱${billing.amountPaid})`); return; }
    if (!reason) { setError('Reason is required'); return; }
    try {
      await onConfirm({ amount: Number(amount), reason, refundMethod, referenceNumber, notes });
    } catch (err) {
      setError(err.response?.data?.message || 'Refund failed');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Refund — {billing.invoiceNumber}</h3>
        <p className="text-sm opacity-60 mt-1">Amount Paid: ₱{billing.amountPaid.toLocaleString()}</p>
        {error && <div className="alert alert-error text-sm py-2 mt-2">{error}</div>}
        <div className="space-y-3 mt-2">
          <div><label className="label-text text-sm">Refund Amount *</label><input type="number" className="input input-bordered w-full" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div><label className="label-text text-sm">Reason *</label><textarea className="textarea textarea-bordered w-full" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
          <div><label className="label-text text-sm">Refund Method *</label>
            <select className="select select-bordered w-full" value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
              {['cash', 'gcash', 'maya', 'bank_transfer', 'credit_card', 'debit_card', 'other'].map((m) => <option key={m}>{m}</option>)}
            </select></div>
          {refundMethod !== 'cash' && (
            <div><label className="label-text text-sm">Reference Number</label><input className="input input-bordered w-full" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} /></div>
          )}
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-warning" onClick={submit}>Process Refund</button>
        </div>
      </div>
    </div>
  );
};
export default RefundModal;