import { AlertTriangle, PackageX, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryAlerts = ({ lowStockItems, expiringItems, expiredItems }) => {
  const navigate = useNavigate();
  const hasAlerts = lowStockItems.length > 0 || expiringItems.length > 0 || expiredItems.length > 0;
  if (!hasAlerts) return null;

  return (
    <div className="space-y-2">
      {expiredItems.slice(0, 3).map((b) => (
        <div key={b._id} className="alert alert-error py-2 px-3 text-sm cursor-pointer" onClick={() => navigate(`/inventory/${b.inventoryItem._id}`)}>
          <AlertTriangle size={16} />
          <span>Batch {b.batchNumber || b.lotNumber || 'N/A'} of <strong>{b.inventoryItem?.name}</strong> has expired and must not be used.</span>
        </div>
      ))}
      {expiringItems.slice(0, 3).map((b) => (
        <div key={b._id} className="alert alert-warning py-2 px-3 text-sm cursor-pointer" onClick={() => navigate(`/inventory/${b.inventoryItem._id}`)}>
          <Clock size={16} />
          <span><strong>{b.inventoryItem?.name}</strong> (batch {b.batchNumber || 'N/A'}) expires {new Date(b.expirationDate).toLocaleDateString()}.</span>
        </div>
      ))}
      {lowStockItems.slice(0, 3).map((i) => (
        <div key={i._id} className={`alert py-2 px-3 text-sm cursor-pointer ${i.quantityRemaining <= 0 ? 'alert-error' : 'alert-warning'}`} onClick={() => navigate(`/inventory/${i._id}`)}>
          <PackageX size={16} />
          <span><strong>{i.item}</strong> {i.quantityRemaining <= 0 ? 'is out of stock' : 'is below reorder level'}.</span>
        </div>
      ))}
    </div>
  );
};
export default InventoryAlerts;