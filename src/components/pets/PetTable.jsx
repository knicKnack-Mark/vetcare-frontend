import { useNavigate } from 'react-router-dom';
import PetStatusBadge from './PetStatusBadge';
import PetActionMenu from './PetActionMenu';
import PetCard from './PetCard';

const petEmoji = { Dog: '🐶', Cat: '🐱', Bird: '🐦', Rabbit: '🐰', Other: '🐾' };

const PetTable = ({ pets, loading, error, hasRecords, onArchive }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">Unable to load pets.</p>
        <p className="text-sm opacity-60 mb-4">Something went wrong while retrieving the pet records.</p>
        <button className="btn btn-sm btn-primary">Try Again</button>
      </div>
    );
  }

  if (pets.length === 0 && !hasRecords) {
    return <div className="text-center py-10"><p className="font-medium mb-1">No pets registered yet.</p><p className="text-sm opacity-60">Add your first pet to get started.</p></div>;
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">No pets found.</p>
        <p className="text-sm opacity-60">Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-3 md:hidden">
      {pets.map((pet) => <PetCard key={pet.id} pet={pet} onArchive={onArchive} />)}
    </div>
    <div className="hidden md:block overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-xs opacity-60">
            <th>Pet</th><th>Pet ID</th><th>Furparent</th><th>Type</th>
            <th>Breed</th><th>Sex</th><th>Age</th><th>Vaccination</th><th>Deworming</th>
            <th>Last Visit</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id} className="hover">
              <td>
                <a onClick={() => navigate(`/pets/${pet.id}`)} className="flex items-center gap-2 cursor-pointer font-medium">
                  <span className="text-lg">{petEmoji[pet.type] || '🐾'}</span> {pet.name}
                </a>
              </td>
              <td className="text-xs opacity-60 font-mono">{pet.id}</td>
              <td className="text-sm">{pet.furparent.name}</td>
              <td className="text-sm">{pet.type}</td>
              <td className="text-sm">{pet.breed}</td>
              <td className="text-sm">{pet.sex}</td>
              <td className="text-sm">{pet.age}</td>
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
    </>
  );
};

export default PetTable;