import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVaccinations } from '../../hooks/useVaccinations';
import VaccinationStats from '../../components/vaccinations/VaccinationStats';
import Pagination from '../../components/Pagination';

const VaccinationsPage = () => {
  const navigate = useNavigate();
  const { vaccinations, summary, pagination, loading, error, search, setSearch, vaccineType, setVaccineType, status, setStatus, page, setPage, refetch } = useVaccinations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vaccinations</h1>
          <p className="text-sm opacity-60">Track administered vaccines and upcoming schedules.</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => navigate('/vaccinations/create')}><Plus size={16} /> Record Vaccination</button>
      </div>

      <VaccinationStats summary={summary} />

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap gap-3 mb-4">
            <input className="input input-bordered input-sm w-64" placeholder="Search pet, owner, vaccine..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="select select-bordered select-sm" value={vaccineType} onChange={(e) => setVaccineType(e.target.value)}>
              <option value="">All Types</option>
              {['Core Vaccine', 'Non-Core Vaccine', 'Puppy Vaccine', 'Kitten Vaccine', 'Annual Booster', 'Rabies', 'Other'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="select select-bordered select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="administered">Administered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
          ) : error ? (
            <div className="text-center py-10"><p>{error}</p><button className="btn btn-sm btn-primary mt-2" onClick={refetch}>Try Again</button></div>
          ) : vaccinations.length === 0 ? (
            <p className="text-center py-10 text-sm opacity-60">No vaccination records found.</p>
          ) : (
            <table className="table">
              <thead><tr className="text-xs opacity-60"><th>Pet</th><th>Owner</th><th>Vaccine</th><th>Administered</th><th>Next Due</th><th>Veterinarian</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {vaccinations.map((v) => (
                  <tr key={v._id} className="hover">
                    <td className="text-sm font-medium">{v.pet?.name}</td>
                    <td className="text-sm">{v.owner?.firstName} {v.owner?.lastName}</td>
                    <td className="text-sm">{v.vaccineName}</td>
                    <td className="text-sm">{new Date(v.administrationDate).toLocaleDateString()}</td>
                    <td className="text-sm">{v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString() : '—'}</td>
                    <td className="text-sm">{v.veterinarian?.name || '—'}</td>
                    <td><span className="badge badge-sm badge-success">{v.status}</span></td>
                    <td><button className="btn btn-ghost btn-xs" onClick={() => navigate(`/vaccinations/${v._id}`)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination page={page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};
export default VaccinationsPage;