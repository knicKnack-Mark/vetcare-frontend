import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerActionMenu = ({ owner, onToggleStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
        <MoreVertical size={16} />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-48 p-2 shadow-lg border border-base-300">
        <li><a onClick={() => navigate(`/owners/${owner._id}`)}>View</a></li>
        <li><a onClick={() => navigate(`/owners/${owner._id}/edit`)}>Edit</a></li>
        <li>
          <a className={owner.status === 'active' ? 'text-error' : 'text-success'} onClick={() => onToggleStatus(owner)}>
            {owner.status === 'active' ? 'Deactivate' : 'Reactivate'}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default OwnerActionMenu;