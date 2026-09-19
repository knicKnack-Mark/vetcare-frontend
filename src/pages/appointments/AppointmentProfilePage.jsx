import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import CancelAppointmentModal from '../../components/appointments/CancelAppointmentModal';
import RescheduleModal from '../../components/appointments/RescheduleModal';
import { appointmentService } from '../../services/appointmentService';

const AppointmentProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const load = () => appointmentService.getById(id).then((res) => setAppt(res.data.appointment)).finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const doAction = async (action, ...args) => {
    try {
      await action(...args);
      toast.success('Updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;
  if (!appt) return <p>Appointment not found.</p>;

  const canEdit = !['completed', 'cancelled'].includes(appt.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/appointments')}><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-2xl font-bold">{appt.title}</h1>
            <AppointmentStatusBadge status={appt.status} />
          </div>
        </div>
        {canEdit && (
          <button className="btn btn-outline gap-2" onClick={() => navigate(`/appointments/${id}/edit`)}>
            <Pencil size={16} /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">Appointment Info</h2>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="opacity-60">Date:</span> {new Date(appt.date).toLocaleDateString()}</p>
              <p><span className="opacity-60">Time:</span> {appt.startTime} – {appt.endTime}</p>
              <p><span className="opacity-60">Type:</span> {appt.appointmentType}</p>
              <p><span className="opacity-60">Service:</span> {appt.service || '—'}</p>
              <p><span className="opacity-60">Priority:</span> {appt.priority}</p>
              <p><span className="opacity-60">Reason:</span> {appt.reason || '—'}</p>
              <p><span className="opacity-60">Notes:</span> {appt.notes || '—'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Pet</h2>
              <p className="text-sm">{appt.pet?.name} — {appt.pet?.petType}/{appt.pet?.breed}</p>
              <Link to={`/pets/${appt.pet?._id}`} className="link link-primary text-sm">View Pet</Link>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Owner</h2>
              <p className="text-sm">{appt.owner?.firstName} {appt.owner?.lastName} · {appt.owner?.mobileNumber}</p>
              <Link to={`/owners/${appt.owner?._id}`} className="link link-primary text-sm">View Owner</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Actions</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {appt.status === 'scheduled' && <button className="btn btn-sm btn-primary" onClick={() => doAction(appointmentService.updateStatus, id, 'confirmed')}>Confirm</button>}
            {['scheduled', 'confirmed'].includes(appt.status) && <button className="btn btn-sm" onClick={() => doAction(appointmentService.updateStatus, id, 'in_progress')}>Start Appointment</button>}
            {appt.status === 'in_progress' && <button className="btn btn-sm btn-success" onClick={() => doAction(appointmentService.complete, id)}>Complete</button>}
            {canEdit && <button className="btn btn-sm btn-outline" onClick={() => setShowReschedule(true)}>Reschedule</button>}
            {['scheduled', 'confirmed'].includes(appt.status) && <button className="btn btn-sm btn-warning" onClick={() => doAction(appointmentService.markNoShow, id)}>Mark No-Show</button>}
            {canEdit && <button className="btn btn-sm btn-error" onClick={() => setShowCancel(true)}>Cancel</button>}
          </div>
        </div>
      </div>

      <CancelAppointmentModal
        appointment={showCancel ? appt : null}
        onCancel={() => setShowCancel(false)}
        onConfirm={(reason) => { doAction(appointmentService.cancel, id, reason); setShowCancel(false); }}
      />
      <RescheduleModal
        appointment={showReschedule ? appt : null}
        onCancel={() => setShowReschedule(false)}
        onConfirm={async (data) => { await appointmentService.reschedule(id, data); toast.success('Rescheduled'); setShowReschedule(false); load(); }}
      />
    </div>
  );
};

export default AppointmentProfilePage;