import { useState } from 'react';

const VoidBillingModal = ({ billing, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [returnInventory, setReturnInventory] = useState(true);
  if (!billing) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Void Invoice {billing.invoiceNumber}?</h3>
        <p className="text-sm py-2 opacity-70">This cannot be undone. Historical records will be preserved.</p>
        <label className="label-text text-sm">Reason *</label>
        <textarea className="textarea textarea-bordered w-full" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        <label className="label cursor-pointer justify-start gap-2 mt-2">
          <input type="checkbox" className="checkbox checkbox-sm" checked={returnInventory} onChange={(e) => setReturnInventory(e.target.checked)} />
          <span className="text-sm">Return deducted inventory to stock</span>
        </label>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error" onClick={() => onConfirm(reason, returnInventory)} disabled={!reason}>Void Invoice</button>
        </div>
      </div>
    </div>
  );
};
export default VoidBillingModal;