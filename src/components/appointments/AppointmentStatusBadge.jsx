const statusMap = {
  scheduled: { label: 'Scheduled', className: 'badge-info' },
  confirmed: { label: 'Confirmed', className: 'badge-primary' },
  in_progress: { label: 'In Progress', className: 'badge-warning' },
  completed: { label: 'Completed', className: 'badge-success' },
  cancelled: { label: 'Cancelled', className: 'badge-ghost' },
  no_show: { label: 'No Show', className: 'badge-error' },
};

const AppointmentStatusBadge = ({ status }) => {
  const s = statusMap[status] || statusMap.scheduled;
  return <span className={`badge badge-sm ${s.className}`}>{s.label}</span>;
};

export default AppointmentStatusBadge;