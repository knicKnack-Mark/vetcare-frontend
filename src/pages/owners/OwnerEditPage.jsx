import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OwnerForm from '../../components/owners/OwnerForm';
import { ownerService } from '../../services/ownerService';

const OwnerEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerService.getOwnerById(id).then((res) => {
      setOwner(res.data.owner);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await ownerService.updateOwner(id, data);
      toast.success('Owner updated successfully');
      navigate(`/owners/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update owner');
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Owner</h1>
        <p className="text-sm opacity-60">Update furparent information.</p>
      </div>
      <OwnerForm initialData={owner} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
};

export default OwnerEditPage;