import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { inventoryService } from '../../services/inventoryService';

const emptyForm = {
  itemCode: '', name: '', genericName: '', description: '', category: 'Medicines', subcategory: '',
  itemType: 'medicine', unit: 'piece', brand: '', manufacturer: '',
  minimumStockLevel: 0, maximumStockLevel: '', reorderLevel: 0, reorderQuantity: '',
  unitCost: 0, sellingPrice: 0,
  supplier: '', supplierContact: '', supplierEmail: '', purchaseReference: '', invoiceNumber: '',
  storageLocation: '', storageCondition: '', temperatureRequirement: '', notes: '',
};

const InventoryCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await inventoryService.create(form);
      toast.success('Inventory item created');
      navigate(`/inventory/${res.data.item._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold">Add Inventory Item</h1></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Item Code *</label><input className="input input-bordered w-full" value={form.itemCode} onChange={(e) => update('itemCode', e.target.value)} /></div>
          <div><label className="label-text text-sm">Name *</label><input className="input input-bordered w-full" value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div><label className="label-text text-sm">Generic Name</label><input className="input input-bordered w-full" value={form.genericName} onChange={(e) => update('genericName', e.target.value)} /></div>
          <div><label className="label-text text-sm">Category *</label>
            <select className="select select-bordered w-full" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {['Vaccines', 'Medicines', 'Dewormers', 'Anti-Rabies', 'Syringes', 'Needles', 'Medical Supplies', 'Diagnostic Supplies', 'Surgical Supplies', 'Grooming Supplies', 'Pet Products', 'Cleaning Supplies', 'Equipment', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Item Type *</label>
            <select className="select select-bordered w-full" value={form.itemType} onChange={(e) => update('itemType', e.target.value)}>
              {['medicine', 'vaccine', 'dewormer', 'anti_rabies', 'medical_supply', 'consumable', 'pet_product', 'equipment', 'other'].map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Unit *</label>
            <select className="select select-bordered w-full" value={form.unit} onChange={(e) => update('unit', e.target.value)}>
              {['piece', 'box', 'bottle', 'vial', 'tube', 'sachet', 'pack', 'tablet', 'capsule', 'ml', 'liter', 'kg', 'gram', 'set', 'other'].map((u) => <option key={u}>{u}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Brand</label><input className="input input-bordered w-full" value={form.brand} onChange={(e) => update('brand', e.target.value)} /></div>
          <div><label className="label-text text-sm">Manufacturer</label><input className="input input-bordered w-full" value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} /></div>
        </div>
        <div className="mt-3"><label className="label-text text-sm">Description</label><textarea className="textarea textarea-bordered w-full" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Stock Thresholds</h2>
        <p className="text-xs opacity-60">Initial quantity is set via "Stock In" after creation, not here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Minimum Stock</label><input type="number" className="input input-bordered w-full" value={form.minimumStockLevel} onChange={(e) => update('minimumStockLevel', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Reorder Level</label><input type="number" className="input input-bordered w-full" value={form.reorderLevel} onChange={(e) => update('reorderLevel', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Maximum Stock</label><input type="number" className="input input-bordered w-full" value={form.maximumStockLevel} onChange={(e) => update('maximumStockLevel', e.target.value)} /></div>
          <div><label className="label-text text-sm">Reorder Quantity</label><input type="number" className="input input-bordered w-full" value={form.reorderQuantity} onChange={(e) => update('reorderQuantity', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Unit Cost</label><input type="number" className="input input-bordered w-full" value={form.unitCost} onChange={(e) => update('unitCost', Number(e.target.value))} /></div>
          <div><label className="label-text text-sm">Selling Price</label><input type="number" className="input input-bordered w-full" value={form.sellingPrice} onChange={(e) => update('sellingPrice', Number(e.target.value))} /></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Supplier & Storage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Supplier</label><input className="input input-bordered w-full" value={form.supplier} onChange={(e) => update('supplier', e.target.value)} /></div>
          <div><label className="label-text text-sm">Supplier Contact</label><input className="input input-bordered w-full" value={form.supplierContact} onChange={(e) => update('supplierContact', e.target.value)} /></div>
          <div><label className="label-text text-sm">Storage Location</label><input className="input input-bordered w-full" value={form.storageLocation} onChange={(e) => update('storageLocation', e.target.value)} /></div>
          <div><label className="label-text text-sm">Temperature Requirement</label><input className="input input-bordered w-full" value={form.temperatureRequirement} onChange={(e) => update('temperatureRequirement', e.target.value)} placeholder="e.g. 2°C - 8°C" /></div>
        </div>
        <div className="mt-3"><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
      </div></div>

      <div className="flex justify-end"><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Create Item'}</button></div>
    </form>
  );
};
export default InventoryCreatePage;