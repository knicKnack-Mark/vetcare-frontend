import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../hooks/usePets';
import PetStats from '../../components/pets/PetStats';
import PetSearch from '../../components/pets/PetSearch';
import PetFilters from '../../components/pets/PetFilters';
import PetTable from '../../components/pets/PetTable';

const PetsPage = () => {
  const navigate = useNavigate();
  const {
    pets, stats, loading, error,
    search, setSearch,
    typeFilter, setTypeFilter,
    sexFilter, setSexFilter,
    breedFilter, setBreedFilter,
    medicalStatusFilter, setMedicalStatusFilter,
    statusFilter, setStatusFilter,
    total, page, setPage, pageSize, totalPages, hasRecords,
  } = usePets();
  const [petToArchive, setPetToArchive] = useState(null);

  const handleReset = () => {
    setSearch('');
    setTypeFilter('All Types');
    setSexFilter('Gender');
    setBreedFilter('All Breeds');
    setMedicalStatusFilter('All Medical Statuses');
    setStatusFilter('Active');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pets</h1>
          <p className="text-sm opacity-60">Manage registered pets and their veterinary records.</p>
        </div>
        <button onClick={() => navigate('/pets/create')} className="btn btn-primary gap-2">
          <Plus size={16} /> Add New Pet
        </button>
      </div>

      <PetStats stats={stats} />

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="w-full lg:flex-1 lg:min-w-0">
              <PetSearch value={search} onChange={setSearch} />
            </div>
            <PetFilters
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              sexFilter={sexFilter} setSexFilter={setSexFilter}
              breedFilter={breedFilter} setBreedFilter={setBreedFilter}
              medicalStatusFilter={medicalStatusFilter} setMedicalStatusFilter={setMedicalStatusFilter}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              onReset={handleReset}
            />
          </div>

          <PetTable pets={pets} loading={loading} error={error} hasRecords={hasRecords} onArchive={setPetToArchive} />

          {!loading && !error && pets.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs opacity-60">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</p>
              <div className="join">
                <button className="btn btn-sm join-item" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
                <button className="btn btn-sm join-item no-animation">{page} / {totalPages}</button>
                <button className="btn btn-sm join-item" disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {petToArchive && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Archive {petToArchive.name}?</h3>
            <p className="py-4 text-sm opacity-70">Are you sure you want to archive {petToArchive.name}? Their records will remain available.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setPetToArchive(null)}>Cancel</button>
              <button className="btn btn-error" onClick={() => setPetToArchive(null)}>Archive Pet</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PetsPage;