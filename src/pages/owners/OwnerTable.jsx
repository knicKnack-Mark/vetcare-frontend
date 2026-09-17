import { useNavigate } from 'react-router-dom';
import OwnerActionMenu from './OwnerActionMenu';

const OwnerTable = ({ owners, loading, error, onToggleStatus }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">Unable to load owners.</p>
        <button className="btn btn-sm btn-primary mt-2">Try Again</button>
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">No owners found.</p>
        <p className="text-sm opacity-60">Try changing your search or add a new owner.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-xs opacity-60">
            <th>Owner</th><th>Contact</th><th>Pets</th><th>Last Visit</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o) => (
            <tr key={o.id} className="hover">
              <td>
                <a onClick={() => navigate(`/owners/${o.id}`)} className="font-medium cursor-pointer">
                  {o.firstName} {o.lastName}
                </a>
              </td>
              <td className="text-sm">{o.mobileNumber}</td>
              <td className="text-sm">{o.petCount}</td>
              <td className="text-sm opacity-70">{o.lastVisit || '—'}</td>
              <td>
                <span className={`badge badge-sm ${o.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                  {o.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td><OwnerActionMenu owner={o} onToggleStatus={onToggleStatus} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerTable;