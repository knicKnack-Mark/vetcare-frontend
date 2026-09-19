import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { inventoryService } from '../../services/inventoryService';

const InventoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    inventoryService.getById(id).then((res) => setForm(res.data.item));
  }, [id]);

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await inventoryService.update(id, form);
      toast.success('Item updated');
      navigate(`/inventory/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="skeleton h-96 w-full" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Edit {form.name}</h1>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Name</label><input className="input input-bordered w-full" value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div><label className="label-text text-sm">Brand</label><input className="input input-bordered w-full" value={form.brand || ''} onChange={(e) => update('brand', e.target.value)} /></div>
          <div><label className="label-text text-sm">Manufacturer</label><input className="input input-bordered w-full" value={form.manufacturer || ''} onChange={(e) => update('manufacturer', e.target.value)} /></div>
          <div><label className="label-text text-sm">Storage Location</label><input className="input input-bordered w-full" value={form.storageLocation || ''} onChange={(e) => update('storageLocation', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Thresholds & Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Minimum Stock</label><input type="number" className="input input-bordered w-full" value={form.minimumStockLevel} onChange={(e) => update('minimumStockLevel', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Reorder Level</label><input type="number" className="input input-bordered w-full" value={form.reorderLevel} onChange={(e) => update('reorderLevel', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Unit Cost</label><input type="number" className="input input-bordered w-full" value={form.unitCost} onChange={(e) => update('unitCost', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Selling Price</label><input type="number" className="input input-bordered w-full" value={form.sellingPrice} onChange={(e) => update('sellingPrice', Number(e.target.value))} /></div>
        </div>
      </div></div>

      <div className="flex justify-end"><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}</button></div>
    </form>
  );
};
export default InventoryEditPage;