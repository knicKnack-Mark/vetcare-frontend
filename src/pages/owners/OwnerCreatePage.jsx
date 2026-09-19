import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OwnerForm from '../../components/owners/OwnerForm';
import { ownerService } from '../../services/ownerService';

const OwnerCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const res = await ownerService.createOwner(data);
      toast.success('Owner registered successfully');
      navigate(`/owners/${res.data.owner._id}`);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('A possible duplicate owner already exists');
      } else {
        toast.error(err.response?.data?.message || 'Failed to create owner');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Add Owner</h1>
        <p className="text-sm opacity-60">Register a new furparent.</p>
      </div>
      <OwnerForm onSubmit={handleSubmit} submitLabel="Register Owner" />
    </div>
  );
};

export default OwnerCreatePage;