import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';

const AppointmentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getById(id).then((res) => {
      const a = res.data.appointment;
      setInitialData({
        petId: a.pet._id, ownerId: a.owner._id,
        appointmentType: a.appointmentType, service: a.service, title: a.title,
        date: a.date.slice(0, 10), startTime: a.startTime, endTime: a.endTime,
        reason: a.reason, notes: a.notes, priority: a.priority,
      });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data) => {
    await appointmentService.update(id, data);
    toast.success('Appointment updated');
    navigate(`/appointments/${id}`);
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Appointment</h1>
        <p className="text-sm opacity-60">Update appointment details.</p>
      </div>
      <AppointmentForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
};

export default AppointmentEditPage;