import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, PackagePlus, PackageMinus, Settings2 } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { StockStatusBadge, ExpirationStatusBadge } from '../../components/inventory/StockBadges';
import StockInModal from '../../components/inventory/StockInModal';
import StockOutModal from '../../components/inventory/StockOutModal';
import AdjustStockModal from '../../components/inventory/AdjustStockModal';

const InventoryProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [batches, setBatches] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState(null);

  const load = () => {
    inventoryService.getById(id).then((res) => { setItem(res.data.item); setBatches(res.data.batches); });
    inventoryService.getTransactions(id).then((res) => setTransactions(res.data));
  };

  useEffect(() => { load(); }, [id]);

  if (!item) return <div className="skeleton h-96 w-full" />;

  const handleStockIn = async (data) => { await inventoryService.stockIn(id, data); toast.success('Stock added'); setModal(null); load(); };
  const handleStockOut = async (data) => { await inventoryService.stockOut(id, data); toast.success('Stock removed'); setModal(null); load(); };
  const handleAdjust = async (data) => { await inventoryService.adjust(id, data); toast.success('Stock adjusted'); setModal(null); load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/inventory')}><ArrowLeft size={18} /></button>
          <div><h1 className="text-2xl font-bold">{item.name}</h1><p className="text-xs opacity-60 font-mono">{item.itemCode}</p></div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline gap-1" onClick={() => setModal('in')}><PackagePlus size={14} /> Stock In</button>
          <button className="btn btn-sm btn-outline gap-1" onClick={() => setModal('out')}><PackageMinus size={14} /> Stock Out</button>
          <button className="btn btn-sm btn-outline gap-1" onClick={() => setModal('adjust')}><Settings2 size={14} /> Adjust</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Stock</h2>
          <div className="text-sm space-y-1 mt-2">
            <p><span className="opacity-60">Remaining:</span> {item.quantityRemaining} {item.unit}</p>
            <p><span className="opacity-60">Reorder Level:</span> {item.reorderLevel}</p>
            <p><span className="opacity-60">Status:</span> <StockStatusBadge status={item.stockStatus} /></p>
          </div>
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Pricing</h2>
          <div className="text-sm space-y-1 mt-2">
            <p><span className="opacity-60">Unit Cost:</span> ₱{item.unitCost}</p>
            <p><span className="opacity-60">Selling Price:</span> ₱{item.sellingPrice}</p>
            <p><span className="opacity-60">Inventory Value:</span> ₱{item.totalInventoryValue?.toLocaleString()}</p>
          </div>
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Info</h2>
          <div className="text-sm space-y-1 mt-2">
            <p><span className="opacity-60">Category:</span> {item.category}</p>
            <p><span className="opacity-60">Type:</span> {item.itemType}</p>
            <p><span className="opacity-60">Brand:</span> {item.brand || '—'}</p>
          </div>
        </div></div>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Batches</h2>
        {batches.length === 0 ? <p className="text-sm opacity-60 py-4 text-center">No batches recorded yet.</p> : (
          <table className="table table-sm">
            <thead><tr className="text-xs opacity-60"><th>Batch</th><th>Lot</th><th>Remaining</th><th>Expiration</th><th>Status</th></tr></thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id}><td className="text-sm">{b.batchNumber || '—'}</td><td className="text-sm">{b.lotNumber || '—'}</td><td className="text-sm">{b.quantityRemaining}</td>
                  <td className="text-sm">{b.expirationDate ? new Date(b.expirationDate).toLocaleDateString() : '—'}</td>
                  <td><ExpirationStatusBadge status={b.expirationStatus} /></td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Transaction History</h2>
        {transactions.length === 0 ? <p className="text-sm opacity-60 py-4 text-center">No transaction history.</p> : (
          <table className="table table-sm">
            <thead><tr className="text-xs opacity-60"><th>Date</th><th>Type</th><th>Qty</th><th>Stock</th><th>Reason</th><th>By</th></tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="text-sm">{new Date(t.transactionDate).toLocaleDateString()}</td>
                  <td className="text-sm capitalize">{t.transactionType}</td>
                  <td className={`text-sm ${t.quantity < 0 ? 'text-error' : 'text-success'}`}>{t.quantity > 0 ? '+' : ''}{t.quantity}</td>
                  <td className="text-sm">{t.previousQuantity} → {t.newQuantity}</td>
                  <td className="text-sm">{t.reason || '—'}</td>
                  <td className="text-sm">{t.performedBy?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>

      <StockInModal item={modal === 'in' ? item : null} onCancel={() => setModal(null)} onConfirm={handleStockIn} />
      <StockOutModal item={modal === 'out' ? item : null} onCancel={() => setModal(null)} onConfirm={handleStockOut} />
      <AdjustStockModal item={modal === 'adjust' ? item : null} onCancel={() => setModal(null)} onConfirm={handleAdjust} />
    </div>
  );
};
export default InventoryProfilePage;