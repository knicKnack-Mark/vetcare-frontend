import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Plus, PawPrint } from 'lucide-react';
import { ownerService } from '../../services/ownerService';

const OwnerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ownerService.getOwnerById(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load owner'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="skeleton h-96 w-full" />;
  if (error) return <p className="text-error">{error}</p>;

  const { owner, pets, summary } = data;

  const calculateAge = (birthDate) => {
    if (!birthDate) return '—';
    const years = (Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return years < 1 ? `${Math.round(years * 12)}mo` : `${Math.floor(years)}y`;
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{owner.firstName} {owner.middleName} {owner.lastName} {owner.suffix}</h1>
            <p className="text-sm opacity-60">{owner.mobileNumber} · {owner.email || 'No email'}</p>
            <span className={`badge badge-sm mt-2 ${owner.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
              {owner.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button className="btn btn-outline gap-2" onClick={() => navigate(`/owners/${id}/edit`)}>
            <Pencil size={16} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Pets', value: summary.totalPets },
          { label: 'Active Pets', value: summary.activePets },
          { label: 'Total Appointments', value: summary.totalAppointments ?? 0 },
          { label: 'Last Visit', value: summary.lastVisit || 'No visit yet' },
        ].map((c) => (
          <div key={c.label} className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs opacity-60 uppercase">{c.label}</p>
              <p className="text-xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base flex items-center gap-2"><PawPrint size={18} /> Pets</h2>
              <button className="btn btn-ghost btn-xs gap-1"><Plus size={14} /> Add Pet</button>
            </div>
            {pets.length === 0 ? (
              <p className="text-sm opacity-60 py-4 text-center">No pets registered yet.</p>
            ) : (
              <ul className="divide-y divide-base-200 mt-2">
                {pets.map((pet) => (
                  <li key={pet._id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">{pet.name}</p>
                      <p className="text-xs opacity-60">{pet.petType} / {pet.breed} · {calculateAge(pet.birthDate)}</p>
                    </div>
                    <Link to={`/pets/${pet._id}`} className="btn btn-ghost btn-xs">View</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Contact Information</h2>
              <div className="text-sm space-y-1 mt-2">
                <p><span className="opacity-60">Mobile:</span> {owner.mobileNumber}</p>
                <p><span className="opacity-60">Alternate:</span> {owner.alternateContactNumber || '—'}</p>
                <p><span className="opacity-60">Email:</span> {owner.email || '—'}</p>
                <p><span className="opacity-60">Preferred:</span> {owner.preferredContactMethod}</p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Address</h2>
              <div className="text-sm space-y-1 mt-2">
                <p>{owner.address.houseStreet}</p>
                <p>{owner.address.barangay}, {owner.address.municipality}</p>
                <p>{owner.address.province} {owner.address.zipCode}</p>
              </div>
            </div>
          </div>

          {owner.notes && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">Notes</h2>
                <p className="text-sm mt-2">{owner.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfilePage;