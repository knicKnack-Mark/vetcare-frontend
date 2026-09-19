import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import OwnerForm from '../../components/owners/OwnerForm'; // not used directly, using inline owner/pet selectors instead
import { billingService } from '../../services/billingService';
import { ownerService } from '../../services/ownerService';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect } from 'react';
import api from '../../services/api';

const ITEM_TYPES = ['service', 'medicine', 'vaccine', 'dewormer', 'anti_rabies', 'laboratory', 'grooming', 'surgery', 'product', 'other'];

const BillingCreatePage = () => {
  const navigate = useNavigate();
  const [ownerQuery, setOwnerQuery] = useState('');
  const [ownerResults, setOwnerResults] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState('');
  const [items, setItems] = useState([{ itemType: 'service', name: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const debouncedOwnerQuery = useDebounce(ownerQuery, 300);

  useEffect(() => {
    if (debouncedOwnerQuery.length < 2) { setOwnerResults([]); return; }
    ownerService.searchOwners(debouncedOwnerQuery).then((res) => setOwnerResults(res.data.matches));
  }, [debouncedOwnerQuery]);

  const selectOwner = async (owner) => {
    setSelectedOwner(owner);
    setOwnerQuery('');
    setOwnerResults([]);
    const res = await api.get(`/owners/${owner._id}/pets`);
    setPets(res.data.data.pets);
  };

  const updateItem = (i, field, value) => setItems((s) => s.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  const addItem = () => setItems((s) => [...s, { itemType: 'service', name: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const removeItem = (i) => setItems((s) => s.filter((_, idx) => idx !== i));

  const itemsWithTotal = items.map((it) => ({ ...it, total: Math.max(0, it.quantity * it.unitPrice - (it.discount || 0)) }));
  const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);
  const discountAmount = discountType === 'percentage' ? subtotal * (discountValue / 100) : Math.min(discountValue, subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleSubmit = async (asDraft = true) => {
    if (!selectedOwner) { toast.error('Please select an owner'); return; }
    if (items.some((i) => !i.name || i.quantity <= 0)) { toast.error('All items need a name and quantity > 0'); return; }

    setSaving(true);
    try {
      const res = await billingService.create({
        owner: selectedOwner._id, pet: petId || undefined, items, discountType, discountValue, notes,
      });
      toast.success('Bill created as draft');
      navigate(`/billing/${res.data.billing._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">New Bill</h1>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Customer</h2>
        {selectedOwner ? (
          <div className="flex items-center justify-between bg-base-200 rounded-lg p-3 mt-2">
            <span className="text-sm font-medium">{selectedOwner.name}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => { setSelectedOwner(null); setPets([]); setPetId(''); }}>Change</button>
          </div>
        ) : (
          <div className="relative mt-2">
            <input className="input input-bordered w-full" placeholder="Search owner..." value={ownerQuery} onChange={(e) => setOwnerQuery(e.target.value)} />
            {ownerResults.length > 0 && (
              <ul className="absolute z-10 bg-base-100 border border-base-300 rounded-lg w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
                {ownerResults.map((o) => <li key={o._id} className="px-3 py-2 hover:bg-base-200 cursor-pointer text-sm" onClick={() => selectOwner(o)}>{o.name} · {o.mobileNumber}</li>)}
              </ul>
            )}
          </div>
        )}
        {pets.length > 0 && (
          <div className="mt-3">
            <label className="label-text text-sm">Pet (optional)</label>
            <select className="select select-bordered w-full" value={petId} onChange={(e) => setPetId(e.target.value)}>
              <option value="">No specific pet</option>
              {pets.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        )}
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base">Items</h2>
          <button className="btn btn-ghost btn-sm gap-1" onClick={addItem}><Plus size={14} /> Add Item</button>
        </div>
        <div className="space-y-3 mt-2">
          {itemsWithTotal.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-2">
                <label className="label-text text-xs">Type</label>
                <select className="select select-bordered select-sm w-full" value={item.itemType} onChange={(e) => updateItem(i, 'itemType', e.target.value)}>
                  {ITEM_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-3"><label className="label-text text-xs">Name</label><input className="input input-bordered input-sm w-full" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} /></div>
              <div className="col-span-1"><label className="label-text text-xs">Qty</label><input type="number" className="input input-bordered input-sm w-full" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} /></div>
              <div className="col-span-2"><label className="label-text text-xs">Unit Price</label><input type="number" className="input input-bordered input-sm w-full" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))} /></div>
              <div className="col-span-2"><label className="label-text text-xs">Discount</label><input type="number" className="input input-bordered input-sm w-full" value={item.discount} onChange={(e) => updateItem(i, 'discount', Number(e.target.value))} /></div>
              <div className="col-span-1"><label className="label-text text-xs">Total</label><p className="text-sm font-medium pt-1">₱{item.total.toFixed(2)}</p></div>
              <div className="col-span-1"><button className="btn btn-ghost btn-xs text-error" onClick={() => removeItem(i)}><Trash2 size={14} /></button></div>
            </div>
          ))}
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Discount & Notes</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Discount Type</label>
            <select className="select select-bordered w-full" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage</option>
            </select></div>
          <div><label className="label-text text-sm">Discount Value</label><input type="number" className="input input-bordered w-full" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} /></div>
        </div>
        <div className="mt-3"><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Discount</span><span>-₱{discountAmount.toFixed(2)}</span></div>
        <div className="divider my-1" />
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₱{totalAmount.toFixed(2)}</span></div>
        <p className="text-xs opacity-60 mt-2">Backend will recalculate and validate all totals — this preview is for convenience only.</p>
      </div></div>

      <div className="flex justify-end">
        <button className="btn btn-primary" disabled={saving} onClick={() => handleSubmit(true)}>
          {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save as Draft'}
        </button>
      </div>
    </div>
  );
};
export default BillingCreatePage;