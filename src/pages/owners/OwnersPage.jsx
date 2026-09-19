import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOwners } from '../../hooks/useOwners';
import OwnerSearch from '../../components/owners/OwnerSearch';
import OwnerFilters from '../../components/owners/OwnerFilters';
import OwnerTable from '../../components/owners/OwnerTable';
import Pagination from '../../components/Pagination';

const OwnersPage = () => {
  const navigate = useNavigate();
  const {
    owners, pagination, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    municipality, setMunicipality,
    province, setProvince,
    contactMethod, setContactMethod,
    sortBy, sortOrder, toggleSort,
    page, setPage, toggleStatus, refetch, resetFilters,
  } = useOwners();
  const [confirmOwner, setConfirmOwner] = useState(null);

  const handleConfirm = async () => {
    await toggleStatus(confirmOwner);
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
          <div className="flex flex-col gap-3 mb-4">
            <OwnerSearch value={search} onChange={setSearch} />
            <OwnerFilters
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              municipality={municipality} setMunicipality={setMunicipality}
              province={province} setProvince={setProvince}
              contactMethod={contactMethod} setContactMethod={setContactMethod}
              onReset={resetFilters}
            />
          </div>

          <OwnerTable
            owners={owners} loading={loading} error={error}
            onToggleStatus={setConfirmOwner} onRetry={refetch}
            sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}
          />

          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
          />
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
              <strong>{confirmOwner.firstName} {confirmOwner.lastName}</strong>?
              {confirmOwner.petCount > 0 && confirmOwner.status === 'active' && (
                <> This owner has <strong>{confirmOwner.petCount}</strong> pet record(s), which will be preserved.</>
              )}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmOwner(null)}>Cancel</button>
              <button className="btn btn-error" onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersPage;