import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentService } from '../../services/appointmentService';
import RescheduleModal from '../../components/appointments/RescheduleModal';

const statusColor = {
  scheduled: 'bg-blue-500/10 text-blue-600',
  confirmed: 'bg-indigo-500/10 text-indigo-600',
  in_progress: 'bg-amber-500/10 text-amber-600',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-gray-400/10 text-gray-500',
  no_show: 'bg-red-500/10 text-red-600',
};

const AppointmentCalendarPage = () => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const loadEvents = useCallback(async () => {
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    try {
      const res = await appointmentService.getAppointments({
        dateFrom: start.toISOString(), dateTo: end.toISOString(), limit: 500,
      });
      setEvents(res.data.appointments);
    } catch {
      toast.error('Failed to load appointments');
    }
  }, [cursor]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const eventsForDay = (day) => events.filter((e) => new Date(e.date).getDate() === day);

  const handleRescheduleConfirm = async (data) => {
    await appointmentService.reschedule(rescheduleTarget._id, data);
    toast.success('Appointment rescheduled');
    setRescheduleTarget(null);
    loadEvents();
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{cursor.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="join">
            <button className="join-item btn btn-sm" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft size={16} /></button>
            <button className="join-item btn btn-sm" onClick={() => setCursor(new Date())}>Today</button>
            <button className="join-item btn btn-sm" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-medium opacity-60 text-center">{d}</div>
          ))}
          {cells.map((day, i) => (
            <div key={i} className={`border border-base-200 rounded-lg min-h-24 ${day ? '' : 'opacity-0'}`}>
              {day && (
                <div className="p-2">
                  <p className="text-xs font-medium mb-1">{day}</p>
                  <div className="space-y-1">
                    {eventsForDay(day).slice(0, 3).map((e) => (
                      <div
                        key={e._id}
                        onClick={() => navigate(`/appointments/${e._id}`)}
                        className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer truncate ${statusColor[e.status]}`}
                        title="Click to view — use Reschedule button on the details page to change date/time"
                      >
                        {e.startTime} {e.pet?.name}
                      </div>
                    ))}
                    {eventsForDay(day).length > 3 && (
                      <p className="text-[10px] opacity-60">+{eventsForDay(day).length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <RescheduleModal
        appointment={rescheduleTarget}
        onCancel={() => setRescheduleTarget(null)}
        onConfirm={handleRescheduleConfirm}
      />
    </div>
  );
};

export default AppointmentCalendarPage;