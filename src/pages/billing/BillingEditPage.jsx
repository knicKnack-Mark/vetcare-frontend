import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { billingService } from '../../services/billingService';

const ITEM_TYPES = ['service', 'medicine', 'vaccine', 'dewormer', 'anti_rabies', 'laboratory', 'grooming', 'surgery', 'product', 'other'];

const BillingEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [items, setItems] = useState([]);
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    billingService.getById(id).then((res) => {
      const b = res.data.billing;
      if (b.billingStatus !== 'draft') {
        toast.error('Only draft bills can be edited');
        navigate(`/billing/${id}`);
        return;
      }
      setBilling(b);
      setItems(b.items.map((i) => ({ itemType: i.itemType, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, discount: i.discount })));
      setDiscountType(b.discountType);
      setDiscountValue(b.discountValue);
      setNotes(b.notes || '');
    });
  }, [id, navigate]);

  if (!billing) return <div className="skeleton h-96 w-full" />;

  const updateItem = (i, field, value) => setItems((s) => s.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  const addItem = () => setItems((s) => [...s, { itemType: 'service', name: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const removeItem = (i) => setItems((s) => s.filter((_, idx) => idx !== i));

  const itemsWithTotal = items.map((it) => ({ ...it, total: Math.max(0, it.quantity * it.unitPrice - (it.discount || 0)) }));
  const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);
  const discountAmount = discountType === 'percentage' ? subtotal * (discountValue / 100) : Math.min(discountValue, subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleSave = async () => {
    if (items.some((i) => !i.name || i.quantity <= 0)) { toast.error('All items need a name and quantity > 0'); return; }
    setSaving(true);
    try {
      await billingService.update(id, { items, discountType, discountValue, notes });
      toast.success('Draft updated');
      navigate(`/billing/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update draft');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Edit Draft Bill</h1>
      <p className="text-sm opacity-60">{billing.owner?.firstName} {billing.owner?.lastName}{billing.pet ? ` — ${billing.pet.name}` : ''}</p>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base">Items</h2>
          <button className="btn btn-ghost btn-sm gap-1" onClick={addItem}><Plus size={14} /> Add Item</button>
        </div>
        <div className="space-y-3 mt-2">
          {itemsWithTotal.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-2"><label className="label-text text-xs">Type</label>
                <select className="select select-bordered select-sm w-full" value={item.itemType} onChange={(e) => updateItem(i, 'itemType', e.target.value)}>
                  {ITEM_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select></div>
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
              <option value="fixed">Fixed Amount</option><option value="percentage">Percentage</option>
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
      </div></div>

      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={() => navigate(`/billing/${id}`)}>Cancel</button>
        <button className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}</button>
      </div>
    </div>
  );
};
export default BillingEditPage;