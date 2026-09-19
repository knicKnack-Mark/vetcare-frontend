import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetActionMenu = ({ pet, onArchive }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-xs"><MoreVertical size={16} /></div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300">
        <li><a onClick={() => navigate(`/pets/${pet._id}`)}>View Profile</a></li>
        <li><a onClick={() => navigate(`/pets/${pet._id}/edit`)}>Edit Pet</a></li>
        <li><a>Add Consultation</a></li>
        <li><a>Add Vaccination</a></li>
        <li><a>Add Deworming</a></li>
        <li><a>Add Anti-Rabies</a></li>
        <li><a className="text-error" onClick={() => onArchive(pet)}>Archive Pet</a></li>
      </ul>
    </div>
  );
};

export default PetActionMenu;