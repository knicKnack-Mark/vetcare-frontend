import { useNavigate } from 'react-router-dom';
import PetStatusBadge from './PetStatusBadge';
import PetActionMenu from './PetActionMenu';

const petEmoji = { Dog: '🐶', Cat: '🐱', Bird: '🐦', Rabbit: '🐰', Other: '🐾' };

const PetTable = ({ pets, loading, error, onArchive, onRetry }) => {
  const navigate = useNavigate();

  if (loading) return <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>;
  if (error) return (
    <div className="text-center py-10">
      <p className="font-medium mb-1">Unable to load pets.</p>
      <p className="text-sm opacity-60 mb-3">{error}</p>
      <button className="btn btn-sm btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  );
  if (pets.length === 0) return (
    <div className="text-center py-10">
      <p className="font-medium mb-1">No pets found.</p>
      <p className="text-sm opacity-60">Try changing your search or filters.</p>
    </div>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="table">
          <thead>
            <tr className="text-xs opacity-60">
              <th>Pet</th><th>Furparent</th><th>Type</th><th>Breed</th><th>Sex</th><th>Age</th>
              <th>Vaccination</th><th>Deworming</th><th>Last Visit</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id} className="hover">
                <td>
                  <a onClick={() => navigate(`/pets/${pet._id}`)} className="flex items-center gap-2 cursor-pointer font-medium">
                    <span className="text-lg">{petEmoji[pet.petType] || '🐾'}</span> {pet.name}
                  </a>
                </td>
                <td className="text-sm">{pet.owner?.firstName} {pet.owner?.lastName}</td>
                <td className="text-sm">{pet.petType}</td>
                <td className="text-sm">{pet.breed || '—'}</td>
                <td className="text-sm">{pet.sex}</td>
                <td className="text-sm">{pet.age || '—'}</td>
                <td><PetStatusBadge status={pet.vaccinationStatus} /></td>
                <td><PetStatusBadge status={pet.dewormingStatus} /></td>
                <td className="text-sm opacity-70">{pet.lastVisit || 'No visit yet'}</td>
                <td>
                  <span className={`badge badge-sm ${pet.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                    {pet.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td><PetActionMenu pet={pet} onArchive={onArchive} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pets.map((pet) => (
          <div key={pet._id} className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <a onClick={() => navigate(`/pets/${pet._id}`)} className="font-medium flex items-center gap-2 cursor-pointer">
                  <span className="text-lg">{petEmoji[pet.petType] || '🐾'}</span> {pet.name}
                </a>
                <PetActionMenu pet={pet} onArchive={onArchive} />
              </div>
              <p className="text-xs opacity-60">{pet.breed} • {pet.sex} • {pet.age}</p>
              <p className="text-xs opacity-60 mt-1">Furparent: {pet.owner?.firstName} {pet.owner?.lastName}</p>
              <div className="flex gap-2 mt-2">
                <PetStatusBadge status={pet.vaccinationStatus} />
                <PetStatusBadge status={pet.dewormingStatus} />
              </div>
              <button onClick={() => navigate(`/pets/${pet._id}`)} className="btn btn-sm btn-outline mt-2">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PetTable;