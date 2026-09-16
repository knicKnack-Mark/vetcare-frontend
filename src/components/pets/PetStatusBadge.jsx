const statusMap = {
  up_to_date: { label: '✓ Up to date', className: 'badge-success' },
  due_soon: { label: '⚠ Due soon', className: 'badge-warning' },
  overdue: { label: '! Overdue', className: 'badge-error' },
};

const PetStatusBadge = ({ status }) => {
  const s = statusMap[status] || statusMap.up_to_date;
  return <span className={`badge badge-sm ${s.className}`}>{s.label}</span>;
};

export default PetStatusBadge;