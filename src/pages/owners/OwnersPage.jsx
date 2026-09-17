import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOwners } from '../../hooks/useOwners';
import OwnerSearch from './OwnerSearch';
import OwnerTable from './OwnerTable';

const OwnersPage = () => {
  const navigate = useNavigate();
  const { owners, loading, error, search, setSearch, statusFilter, setStatusFilter } = useOwners();
  const [confirmOwner, setConfirmOwner] = useState(null);

  const handleToggleStatus = (owner) => setConfirmOwner(owner);
  const confirmToggle = () => {
    // wire up PATCH /api/owners/:id/status here
    setConfirmOwner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Owners</h1>
          <p className="text-sm opacity-60">Manage furparents and their contact information.</p>
        </div>
        <button onClick={() => navigate('/owners/create')} className="btn btn-primary gap-2">
          <Plus size={16} /> Add Owner
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <OwnerSearch value={search} onChange={setSearch} />
            <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </select>
          </div>

          <OwnerTable owners={owners} loading={loading} error={error} onToggleStatus={handleToggleStatus} />
        </div>
      </div>

      {confirmOwner && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {confirmOwner.status === 'active' ? 'Deactivate' : 'Reactivate'} Owner?
            </h3>
            <p className="py-4 text-sm">
              Are you sure you want to {confirmOwner.status === 'active' ? 'deactivate' : 'reactivate'}{' '}
              <strong>{confirmOwner.firstName} {confirmOwner.lastName}</strong>? Their historical records will be preserved.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmOwner(null)}>Cancel</button>
              <button className="btn btn-error" onClick={confirmToggle}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersPage;