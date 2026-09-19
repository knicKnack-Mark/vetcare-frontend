import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dewormingService } from '../../services/dewormingService';

const DewormingsPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ total: 0, thisMonth: 0, upcoming: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dewormingService.getAll({ limit: 20 }), dewormingService.getSummary()])
      .then(([listRes, sumRes]) => { setRows(listRes.data.dewormings); setSummary(sumRes.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Deworming</h1><p className="text-sm opacity-60">Track deworming records and schedules.</p></div>
        <button className="btn btn-primary gap-2" onClick={() => navigate('/dewormings/create')}><Plus size={16} /> Record Deworming</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{ label: 'Total', value: summary.total }, { label: 'This Month', value: summary.thisMonth }, { label: 'Upcoming', value: summary.upcoming }, { label: 'Overdue', value: summary.overdue, danger: true }].map((c) => (
          <div key={c.label} className="card bg-base-100 shadow-sm"><div className="card-body p-4">
            <p className="text-xs opacity-60 uppercase">{c.label}</p>
            <p className={`text-2xl font-bold ${c.danger ? 'text-error' : ''}`}>{c.value}</p>
          </div></div>
        ))}
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="text-center py-10 text-sm opacity-60">No deworming records found.</p>
        ) : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Pet</th><th>Owner</th><th>Medicine</th><th>Administered</th><th>Next Due</th><th></th></tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d._id} className="hover">
                  <td className="text-sm font-medium">{d.pet?.name}</td>
                  <td className="text-sm">{d.owner?.firstName} {d.owner?.lastName}</td>
                  <td className="text-sm">{d.medicineName}</td>
                  <td className="text-sm">{new Date(d.administrationDate).toLocaleDateString()}</td>
                  <td className="text-sm">{d.nextDueDate ? new Date(d.nextDueDate).toLocaleDateString() : '—'}</td>
                  <td><button className="btn btn-ghost btn-xs" onClick={() => navigate(`/dewormings/${d._id}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
};
export default DewormingsPage;