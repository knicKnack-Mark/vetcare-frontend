import AppointmentStatusBadge from './AppointmentStatusBadge';

const AppointmentTable = ({ appointments, loading, error, onRetry, onAction }) => {
  if (loading) {
    return <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>;
  }
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">Unable to load appointments.</p>
        <button className="btn btn-sm btn-primary" onClick={onRetry}>Try Again</button>
      </div>
    );
  }
  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-medium mb-1">No appointments found.</p>
        <p className="text-sm opacity-60">Try changing your filters or schedule a new appointment.</p>
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr className="text-xs opacity-60">
          <th>Date</th><th>Time</th><th>Pet</th><th>Owner</th><th>Type</th><th>Priority</th><th>Status</th><th></th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a._id} className="hover">
            <td className="text-sm">{new Date(a.date).toLocaleDateString()}</td>
            <td className="font-mono text-sm">{a.startTime}</td>
            <td className="text-sm font-medium">{a.pet?.name}</td>
            <td className="text-sm">{a.owner?.firstName} {a.owner?.lastName}</td>
            <td className="text-sm">{a.appointmentType}</td>
            <td>
              {a.priority !== 'normal' && (
                <span className={`badge badge-sm ${a.priority === 'emergency' ? 'badge-error' : 'badge-warning'}`}>
                  {a.priority}
                </span>
              )}
            </td>
            <td><AppointmentStatusBadge status={a.status} /></td>
            <td>
              <div className="dropdown dropdown-end dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">⋮</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-44 p-2 shadow-lg border border-base-300">
                  {a.status === 'scheduled' && <li><a onClick={() => onAction(a, 'confirmed')}>Confirm</a></li>}
                  {['scheduled', 'confirmed'].includes(a.status) && <li><a onClick={() => onAction(a, 'in_progress')}>Start</a></li>}
                  {a.status === 'in_progress' && <li><a onClick={() => onAction(a, 'completed')}>Complete</a></li>}
                  {['scheduled', 'confirmed'].includes(a.status) && <li><a onClick={() => onAction(a, 'no_show')}>Mark No-Show</a></li>}
                  {['scheduled', 'confirmed'].includes(a.status) && <li><a className="text-error" onClick={() => onAction(a, 'cancelled')}>Cancel</a></li>}
                </ul>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentTable;