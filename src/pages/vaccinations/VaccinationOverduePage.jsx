import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccinationService } from '../../services/vaccinationService';

const VaccinationOverduePage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaccinationService.getOverdue().then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, []);

  const scheduleNext = (row) => {
    navigate(`/appointments/create?pet=${row.pet._id}&type=Vaccination&service=${encodeURIComponent(row.vaccineName)}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overdue Vaccinations</h1>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="text-center py-10 text-sm opacity-60">No overdue vaccinations. 🎉</p>
        ) : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Pet</th><th>Owner</th><th>Vaccine</th><th>Was Due</th><th>Days Overdue</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="hover">
                  <td className="text-sm font-medium">{r.pet?.name}</td>
                  <td className="text-sm">{r.owner?.firstName} {r.owner?.lastName} · {r.owner?.mobileNumber}</td>
                  <td className="text-sm">{r.vaccineName}</td>
                  <td className="text-sm">{new Date(r.dueDate).toLocaleDateString()}</td>
                  <td><span className="badge badge-sm badge-error">{r.daysOverdue}d overdue</span></td>
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
export default VaccinationOverduePage;