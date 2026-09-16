import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetActionMenu = ({ pet, onArchive }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
        <MoreVertical size={16} />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
        <li><a onClick={() => navigate(`/pets/${pet.id}`)}>View Profile</a></li>
        <li><a>Edit Pet</a></li>
        <li><a>Add Consultation</a></li>
        <li><a>Add Vaccination</a></li>
        <li><a>Add Deworming</a></li>
        <li><a>Add Anti-Rabies</a></li>
        <li><a onClick={() => onArchive(pet)} className="text-error">Archive Pet</a></li>
      </ul>
    </div>
  );
};

export default PetActionMenu;