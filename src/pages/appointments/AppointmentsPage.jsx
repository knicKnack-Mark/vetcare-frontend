import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import AppointmentCalendarPage from './AppointmentCalendarPage';
import Pagination from '../../components/Pagination';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const {
    appointments, pagination, loading, error,
    search, setSearch, status, setStatus, appointmentType, setAppointmentType,
    page, setPage, changeStatus, refetch,
  } = useAppointments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm opacity-60">Manage clinic schedule and visits.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="join">
            <button className={`join-item btn btn-sm ${view === 'calendar' ? 'btn-active' : ''}`} onClick={() => setView('calendar')}>Calendar</button>
            <button className={`join-item btn btn-sm ${view === 'list' ? 'btn-active' : ''}`} onClick={() => setView('list')}>List</button>
          </div>
          <button className="btn btn-primary gap-2" onClick={() => navigate('/appointments/create')}>
            <Plus size={16} /> New Appointment
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <AppointmentCalendarPage />
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex flex-wrap gap-3 mb-4">
              <input className="input input-bordered input-sm w-64" placeholder="Search by pet, owner, type..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="select select-bordered select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <select className="select select-bordered select-sm" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                <option value="">All Types</option>
                {['Checkup', 'Vaccination', 'Deworming', 'Anti-Rabies', 'Follow-up', 'Consultation', 'Surgery', 'Laboratory', 'Grooming', 'Emergency', 'Other'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <AppointmentTable appointments={appointments} loading={loading} error={error} onRetry={refetch} onAction={changeStatus} />
            <Pagination page={page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;