import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccinationService } from '../../services/vaccinationService';

const RANGES = [{ label: 'Next 7 days', value: 7 }, { label: 'Next 14 days', value: 14 }, { label: 'Next 30 days', value: 30 }];

const VaccinationUpcomingPage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState(14);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    vaccinationService.getUpcoming(days).then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, [days]);

  const scheduleNext = (row) => {
    navigate(`/appointments/create?pet=${row.pet._id}&type=Vaccination&service=${encodeURIComponent(row.vaccineName)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upcoming Vaccinations</h1>
        <div className="join">
          {RANGES.map((r) => (
            <button key={r.value} className={`join-item btn btn-sm ${days === r.value ? 'btn-active' : ''}`} onClick={() => setDays(r.value)}>{r.label}</button>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="text-center py-10 text-sm opacity-60">No upcoming vaccinations in this range.</p>
        ) : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Pet</th><th>Owner</th><th>Vaccine</th><th>Due Date</th><th>Days Remaining</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="hover">
                  <td className="text-sm font-medium">{r.pet?.name}</td>
                  <td className="text-sm">{r.owner?.firstName} {r.owner?.lastName} · {r.owner?.mobileNumber}</td>
                  <td className="text-sm">{r.vaccineName}</td>
                  <td className="text-sm">{new Date(r.nextDueDate).toLocaleDateString()}</td>
                  <td><span className="badge badge-sm badge-info">{r.daysRemaining}d left</span></td>
                  <td><button className="btn btn-ghost btn-xs" onClick={() => scheduleNext(r)}>Schedule Appointment</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
};
export default VaccinationUpcomingPage;