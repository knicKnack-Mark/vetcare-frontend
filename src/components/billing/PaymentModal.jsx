import { useState } from 'react';

const PaymentModal = ({ billing, onCancel, onConfirm }) => {
  const [amount, setAmount] = useState(billing?.balance || 0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  if (!billing) return null;

  const remainingAfter = billing.balance - Number(amount || 0);

  const submit = async () => {
    if (!amount || amount <= 0) { setError('Amount must be greater than zero'); return; }
    if (amount > billing.balance) { setError(`Cannot exceed outstanding balance of ₱${billing.balance}`); return; }
    if (paymentMethod !== 'cash' && !referenceNumber) { setError('Reference number required for this payment method'); return; }
    try {
      await onConfirm({ amount: Number(amount), paymentMethod, referenceNumber, notes });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Payment — {billing.invoiceNumber}</h3>
        <div className="text-sm py-2 space-y-1">
          <p><span className="opacity-60">Total:</span> ₱{billing.totalAmount.toLocaleString()}</p>
          <p><span className="opacity-60">Already Paid:</span> ₱{billing.amountPaid.toLocaleString()}</p>
          <p><span className="opacity-60">Outstanding:</span> ₱{billing.balance.toLocaleString()}</p>
        </div>
        {error && <div className="alert alert-error text-sm py-2">{error}</div>}
        <div className="space-y-3 mt-2">
          <div><label className="label-text text-sm">Payment Amount *</label><input type="number" className="input input-bordered w-full" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <p className="text-xs opacity-60">Remaining after payment: ₱{Math.max(0, remainingAfter).toLocaleString()}</p>
          <div><label className="label-text text-sm">Payment Method *</label>
            <select className="select select-bordered w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {['cash', 'gcash', 'maya', 'bank_transfer', 'credit_card', 'debit_card', 'other'].map((m) => <option key={m}>{m}</option>)}
            </select></div>
          {paymentMethod !== 'cash' && (
            <div><label className="label-text text-sm">Reference Number *</label><input className="input input-bordered w-full" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} /></div>
          )}
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Record Payment</button>
        </div>
      </div>
    </div>
  );
};
export default PaymentModal;