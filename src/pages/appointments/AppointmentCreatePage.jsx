import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';
import { useSearchParams } from 'react-router-dom';

const AppointmentCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetType = searchParams.get('type');
  const presetService = searchParams.get('service');
  const handleSubmit = async (data) => {
    const res = await appointmentService.create(data);
    toast.success('Appointment scheduled');
    navigate(`/appointments/${res.data.appointment._id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">New Appointment</h1>
        <p className="text-sm opacity-60">Schedule a visit for a pet.</p>
      </div>
      <AppointmentForm
        onSubmit={handleSubmit}
        initialData={presetType ? { appointmentType: presetType, service: presetService || '', date: '', startTime: '', endTime: '', reason: '', notes: '', priority: 'normal', petId: '', ownerId: '' } : undefined}
      />
    </div>
  );
};

export default AppointmentCreatePage;