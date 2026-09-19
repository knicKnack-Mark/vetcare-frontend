const VaccinationStats = ({ summary }) => {
  const cards = [
    { label: 'Total Vaccinations', value: summary.total },
    { label: 'This Month', value: summary.thisMonth },
    { label: 'Upcoming', value: summary.upcoming },
    { label: 'Due Today', value: summary.dueToday },
    { label: 'Overdue', value: summary.overdue, danger: true },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs opacity-60 uppercase">{c.label}</p>
            <p className={`text-2xl font-bold ${c.danger ? 'text-error' : ''}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default VaccinationStats;