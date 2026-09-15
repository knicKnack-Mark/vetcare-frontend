import { PawPrint, Users, CalendarCheck, PackageX } from 'lucide-react';

const statCards = [
  { label: 'Total Pets', value: 0, icon: PawPrint, color: 'text-primary' },
  { label: 'Total Owners', value: 0, icon: Users, color: 'text-secondary' },
  { label: "Today's Appointments", value: 0, icon: CalendarCheck, color: 'text-accent' },
  { label: 'Low Stock Items', value: 0, icon: PackageX, color: 'text-error' },
];

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Good morning, Doctor! 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center justify-between p-5">
              <div>
                <p className="text-xs opacity-60">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon className={color} size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">Today's Appointments</h2>
            <div className="text-sm opacity-60 py-6 text-center">No appointments yet</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">Upcoming Vaccinations</h2>
            <div className="text-sm opacity-60 py-6 text-center">No vaccinations due</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;