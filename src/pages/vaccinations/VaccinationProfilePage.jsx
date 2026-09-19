import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vaccinationService } from '../../services/vaccinationService';

const VaccinationProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { vaccinationService.getById(id).then((res) => setV(res.data.vaccination)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className="skeleton h-96 w-full" />;
  if (!v) return <p>Record not found.</p>;

  return (
    <div className="space-y-6">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccinations')}>← Vaccinations</button>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/vaccinations/${id}/edit`)}>Edit Record</button>
      <h1 className="text-2xl font-bold">{v.vaccineName} — {v.pet?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Pet</h2>
          <p className="text-sm">{v.pet?.name} — {v.pet?.petType}/{v.pet?.breed} · {v.pet?.sex}</p>
          <Link to={`/pets/${v.pet?._id}`} className="link link-primary text-sm">View Pet</Link>
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Owner</h2>
          <p className="text-sm">{v.owner?.firstName} {v.owner?.lastName} · {v.owner?.mobileNumber} · {v.owner?.email}</p>
          <Link to={`/owners/${v.owner?._id}`} className="link link-primary text-sm">View Owner</Link>
        </div></div>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Vaccine Info</h2>
        <div className="text-sm space-y-1 mt-2">
          <p><span className="opacity-60">Type:</span> {v.vaccineType}</p>
          <p><span className="opacity-60">Manufacturer:</span> {v.manufacturer || '—'}</p>
          <p><span className="opacity-60">Batch:</span> {v.batchNumber || '—'} · Lot: {v.lotNumber || '—'}</p>
          <p><span className="opacity-60">Expiration:</span> {v.expirationDate ? new Date(v.expirationDate).toLocaleDateString() : '—'}</p>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Administration & Schedule</h2>
        <div className="text-sm space-y-1 mt-2">
          <p><span className="opacity-60">Administered:</span> {new Date(v.administrationDate).toLocaleDateString()}</p>
          <p><span className="opacity-60">Next Due:</span> {v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString() : '—'}</p>
          <p><span className="opacity-60">Dose:</span> {v.dose || '—'} · Route: {v.route}</p>
          <p><span className="opacity-60">Site:</span> {v.administrationSite || '—'}</p>
          <p><span className="opacity-60">Veterinarian:</span> {v.veterinarian?.name || '—'}</p>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Reaction & Notes</h2>
        <p className="text-sm mt-2"><span className="opacity-60">Reaction:</span> {v.reaction}</p>
        <p className="text-sm"><span className="opacity-60">Notes:</span> {v.notes || '—'}</p>
      </div></div>

      {v.appointment && (
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Linked Appointment</h2>
          <Link to={`/appointments/${v.appointment._id}`} className="link link-primary text-sm">View Appointment</Link>
        </div></div>
      )}
    </div>
  );
};
export default VaccinationProfilePage;