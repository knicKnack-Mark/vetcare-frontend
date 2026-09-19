import { useState, useEffect } from 'react';
import { Plus, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import { StockStatusBadge } from '../../components/inventory/StockBadges';
import InventoryAlerts from '../../components/inventory/InventoryAlerts';


const InventoryPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalUnits: 0, totalInventoryValue: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0, expired: 0 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const load = () => {
    setLoading(true);
      Promise.all([
        inventoryService.getAll({ search: search || undefined, category: category || undefined, limit: 50 }),
        inventoryService.getSummary(),
        inventoryService.getLowStock(),
        inventoryService.getExpiring(30),
        inventoryService.getExpired(),
      ]).then(([listRes, sumRes, lowRes, expiringRes, expiredRes]) => {
        setItems(listRes.data); setSummary(sumRes.data);
        setLowStockItems(lowRes.data); setExpiringItems(expiringRes.data); setExpiredItems(expiredRes.data);
      }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Inventory</h1><p className="text-sm opacity-60">Manage medicines, vaccines, and clinic supplies.</p></div>
        <div className="flex gap-2">
          <div className="tabs tabs-boxed w-fit">
            <a className="tab tab-active">All Items</a>
            <a className="tab" onClick={() => navigate('/inventory/expiring')}>Expiring</a>
            <a className="tab" onClick={() => navigate('/inventory/expired')}>Expired</a>
          </div>
          <button className="btn btn-outline gap-2" onClick={() => navigate('/inventory/create')}><Plus size={16} /> Add Item</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: summary.totalItems },
          { label: 'Total Units', value: summary.totalUnits },
          { label: 'Inventory Value', value: `₱${summary.totalInventoryValue.toLocaleString()}` },
          { label: 'Low Stock', value: summary.lowStock, danger: summary.lowStock > 0 },
          { label: 'Out of Stock', value: summary.outOfStock, danger: summary.outOfStock > 0 },
          { label: 'Expiring Soon', value: summary.expiringSoon, danger: summary.expiringSoon > 0 },
          { label: 'Expired', value: summary.expired, danger: summary.expired > 0 },
        ].map((c) => (
          <div key={c.label} className="card bg-base-100 shadow-sm"><div className="card-body p-4">
            <p className="text-xs opacity-60 uppercase">{c.label}</p>
            <p className={`text-2xl font-bold ${c.danger ? 'text-error' : ''}`}>{c.value}</p>
          </div></div>
        ))}
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <div className="flex flex-wrap gap-3 mb-4">
          <input className="input input-bordered input-sm w-64" placeholder="Search item, code, brand..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="select select-bordered select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {['Vaccines', 'Medicines', 'Dewormers', 'Anti-Rabies', 'Syringes', 'Needles', 'Medical Supplies', 'Diagnostic Supplies', 'Surgical Supplies', 'Grooming Supplies', 'Pet Products', 'Cleaning Supplies', 'Equipment', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : items.length === 0 ? (
          <p className="text-center py-10 text-sm opacity-60">No inventory items found.</p>
        ) : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Item Code</th><th>Name</th><th>Category</th><th>Qty</th><th>Unit</th><th>Cost</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id} className="hover">
                  <td className="text-xs font-mono">{i.itemCode}</td>
                  <td className="text-sm font-medium cursor-pointer" onClick={() => navigate(`/inventory/${i._id}`)}>{i.name}</td>
                  <td className="text-sm">{i.category}</td>
                  <td className="text-sm">{i.quantityRemaining}</td>
                  <td className="text-sm">{i.unit}</td>
                  <td className="text-sm">₱{i.unitCost}</td>
                  <td className="text-sm">₱{i.sellingPrice}</td>
                  <td><StockStatusBadge status={i.stockStatus} /></td>
                  <td><button className="btn btn-ghost btn-xs" onClick={() => navigate(`/inventory/${i._id}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
      <InventoryAlerts lowStockItems={lowStockItems} expiringItems={expiringItems} expiredItems={expiredItems} />
    </div>
  );
};
export default InventoryPage;