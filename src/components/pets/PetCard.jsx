import { useNavigate } from 'react-router-dom';
import PetActionMenu from './PetActionMenu';
import PetStatusBadge from './PetStatusBadge';

const PetCard = ({ pet, onArchive }) => {
  const navigate = useNavigate();

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-3">
          <button className="text-left" onClick={() => navigate(`/pets/${pet.id}`)}>
            <p className="font-semibold text-base">{pet.name}</p>
            <p className="text-xs opacity-60 font-mono">{pet.id}</p>
          </button>
          <PetActionMenu pet={pet} onArchive={onArchive} />
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-2">
          <div><p className="text-xs opacity-60">Furparent</p><p>{pet.furparent.name}</p></div>
          <div><p className="text-xs opacity-60">Type / Sex</p><p>{pet.type} / {pet.sex}</p></div>
          <div><p className="text-xs opacity-60">Breed / Age</p><p>{pet.breed} / {pet.age}</p></div>
          <div><p className="text-xs opacity-60">Last Visit</p><p>{pet.lastVisit || 'No visit yet'}</p></div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-base-200">
          <PetStatusBadge status={pet.vaccinationStatus} />
          <PetStatusBadge status={pet.dewormingStatus} />
          <span className="badge badge-sm badge-outline capitalize">{pet.medicalStatus.replace('_', ' ')}</span>
        </div>
      </div>
    </article>
  );
};

export default PetCard;
