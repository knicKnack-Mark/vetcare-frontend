import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import OwnerActionMenu from './OwnerActionMenu';

const SortableHeader = ({ field, label, sortBy, sortOrder, onSort }) => (
  <th className="cursor-pointer select-none" onClick={() => onSort(field)}>
    <span className="flex items-center gap-1">
      {label}
      {sortBy === field && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
    </span>
  </th>
);

const OwnerTable = ({ owners, loading, error, onToggleStatus, onRetry, sortBy, sortOrder, onSort }) => {
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
        <p className="text-sm opacity-60 mb-3">{error}</p>
        <button className="btn btn-sm btn-primary" onClick={onRetry}>Try Again</button>
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
    <table className="table">
      <thead>
        <tr className="text-xs opacity-60">
          <SortableHeader field="lastName" label="Owner" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          <th>Contact</th>
          <th>Pets</th>
          <SortableHeader field="createdAt" label="Registered" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {owners.map((o) => (
          <tr key={o._id} className="hover">
            <td>
              <a onClick={() => navigate(`/owners/${o._id}`)} className="font-medium cursor-pointer">
                {o.firstName} {o.lastName}
              </a>
            </td>
            <td className="text-sm">{o.mobileNumber}</td>
            <td className="text-sm">{o.petCount ?? 0}</td>
            <td className="text-sm opacity-70">{new Date(o.createdAt).toLocaleDateString()}</td>
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
  );
};

export default OwnerTable;