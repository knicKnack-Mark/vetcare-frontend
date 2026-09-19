import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dewormingService } from '../../services/dewormingService';

const DewormingProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [d, setD] = useState(null);

  useEffect(() => { dewormingService.getById(id).then((res) => setD(res.data.deworming)); }, [id]);
  if (!d) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="space-y-6">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dewormings')}>← Deworming</button>
      <h1 className="text-2xl font-bold">{d.medicineName} — {d.pet?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Pet</h2>
          <p className="text-sm">{d.pet?.name}</p>
          <Link to={`/pets/${d.pet?._id}`} className="link link-primary text-sm">View Pet</Link>
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Owner</h2>
          <p className="text-sm">{d.owner?.firstName} {d.owner?.lastName} · {d.owner?.mobileNumber}</p>
          <Link to={`/owners/${d.owner?._id}`} className="link link-primary text-sm">View Owner</Link>
        </div></div>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Treatment Info</h2>
        <div className="text-sm space-y-1 mt-2">
          <p><span className="opacity-60">Administered:</span> {new Date(d.administrationDate).toLocaleDateString()}</p>
          <p><span className="opacity-60">Next Due:</span> {d.nextDueDate ? new Date(d.nextDueDate).toLocaleDateString() : '—'}</p>
          <p><span className="opacity-60">Dosage:</span> {d.dosage || '—'} · Route: {d.route}</p>
          <p><span className="opacity-60">Reaction:</span> {d.reaction}</p>
          <p><span className="opacity-60">Notes:</span> {d.notes || '—'}</p>
        </div>
      </div></div>
    </div>
  );
};
export default DewormingProfilePage;