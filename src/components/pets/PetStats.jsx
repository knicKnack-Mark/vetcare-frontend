const PetStats = ({ stats }) => {
  const cards = [
    { label: 'Total Pets', value: stats.total },
    { label: 'Dogs', value: stats.dogs },
    { label: 'Cats', value: stats.cats },
    { label: 'Vaccinations Due', value: stats.vaccineDue },
    { label: 'Deworming Due', value: stats.dewormDue },
    { label: 'Anti-Rabies Due', value: stats.antiRabiesDue },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs opacity-60 uppercase tracking-wide">{c.label}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetStats;