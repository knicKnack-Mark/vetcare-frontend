import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetForm from '../../components/pets/PetForm';
import { petService } from '../../services/petService';

const PetCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const res = await petService.create(data);
      toast.success('Pet registered successfully');
      navigate(`/pets/${res.data.pet._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register pet');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Add New Pet</h1>
        <p className="text-sm opacity-60">Register a new pet to the clinic.</p>
      </div>
      <PetForm onSubmit={handleSubmit} submitLabel="Register Pet" />
    </div>
  );
};

export default PetCreatePage;