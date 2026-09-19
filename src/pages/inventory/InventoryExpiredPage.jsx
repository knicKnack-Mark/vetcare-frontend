import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';

const InventoryExpiredPage = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { inventoryService.getExpired().then((res) => setBatches(res.data)).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expired Items</h1>
      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        : batches.length === 0 ? <p className="text-center py-10 text-sm opacity-60">No expired items. 🎉</p>
        : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Item</th><th>Batch</th><th>Remaining</th><th>Expired On</th><th></th></tr></thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id} className="hover">
                  <td className="text-sm font-medium">{b.inventoryItem?.name}</td>
                  <td className="text-sm">{b.batchNumber || '—'}</td>
                  <td className="text-sm">{b.quantityRemaining}</td>
                  <td><span className="badge badge-sm badge-error">{new Date(b.expirationDate).toLocaleDateString()}</span></td>
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
export default InventoryExpiredPage;