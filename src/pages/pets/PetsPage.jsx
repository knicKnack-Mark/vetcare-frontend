import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../hooks/usePets';
import PetStats from '../../components/pets/PetStats';
import PetSearch from '../../components/pets/PetSearch';
import PetFilters from '../../components/pets/PetFilters';
import PetTable from '../../components/pets/PetTable';
import ArchivePetModal from '../../components/pets/ArchivePetModal';
import Pagination from '../../components/Pagination';

const PetsPage = () => {
  const navigate = useNavigate();
  const {
    pets, stats, pagination, loading, error,
    search, setSearch, petType, setPetType, breed, setBreed, sex, setSex,
    statusFilter, setStatusFilter, page, setPage, archivePet, resetFilters, refetch,
  } = usePets();
  const [confirmPet, setConfirmPet] = useState(null);

  const handleConfirmArchive = async () => {
    await archivePet(confirmPet);
    setConfirmPet(null);
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
          <div className="flex flex-col gap-3 mb-4">
            <PetSearch value={search} onChange={setSearch} />
            <PetFilters
              petType={petType} setPetType={setPetType}
              breed={breed} setBreed={setBreed}
              sex={sex} setSex={setSex}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              onReset={resetFilters}
            />
          </div>

          <PetTable pets={pets} loading={loading} error={error} onArchive={setConfirmPet} onRetry={refetch} />

          <Pagination page={page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
        </div>
      </div>

      <ArchivePetModal pet={confirmPet} onConfirm={handleConfirmArchive} onCancel={() => setConfirmPet(null)} />
    </div>
  );
};

export default PetsPage;