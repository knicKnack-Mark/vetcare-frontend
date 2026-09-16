const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="card-body p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium opacity-60 uppercase tracking-wide">{label}</p>
        <div className={`${color} bg-base-200 rounded-full p-2`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
      <p className="text-xs opacity-50 mt-1">{trend}</p>
    </div>
  </div>
);

export default StatCard;