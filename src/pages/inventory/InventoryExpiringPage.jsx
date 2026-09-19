import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';

const InventoryExpiringPage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    inventoryService.getExpiring(days).then((res) => setBatches(res.data)).finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expiring Items</h1>
        <div className="join">
          {[7, 14, 30, 60].map((d) => (
            <button key={d} className={`join-item btn btn-sm ${days === d ? 'btn-active' : ''}`} onClick={() => setDays(d)}>{d}d</button>
          ))}
        </div>
      </div>
      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        : batches.length === 0 ? <p className="text-center py-10 text-sm opacity-60">No items expiring in this range.</p>
        : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Item</th><th>Batch</th><th>Remaining</th><th>Expiration</th><th></th></tr></thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id} className="hover">
                  <td className="text-sm font-medium">{b.inventoryItem?.name}</td>
                  <td className="text-sm">{b.batchNumber || '—'}</td>
                  <td className="text-sm">{b.quantityRemaining}</td>
                  <td><span className="badge badge-sm badge-warning">{new Date(b.expirationDate).toLocaleDateString()}</span></td>
                  <td><button className="btn btn-ghost btn-xs" onClick={() => navigate(`/inventory/${b.inventoryItem._id}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
};
export default InventoryExpiringPage;