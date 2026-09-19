import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetForm from '../../components/pets/PetForm';
import { petService } from '../../services/petService';

const PetEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petService.getById(id).then((res) => {
      const p = res.data.pet;
      setPet({ ...p, owner: p.owner._id, ownerName: `${p.owner.firstName} ${p.owner.lastName}` });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await petService.update(id, data);
      toast.success('Pet updated successfully');
      navigate(`/pets/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update pet');
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Pet</h1>
        <p className="text-sm opacity-60">Update {pet.name}'s information.</p>
      </div>
      <PetForm initialData={pet} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
};

export default PetEditPage;