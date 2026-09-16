import {
  PawPrint, Users, CalendarCheck, PackageX, Syringe, Clock,
  TrendingUp, AlertTriangle, Plus, FileText, Bell,
} from 'lucide-react';

const stats = [
  { label: 'Total Pets', value: 1248, icon: PawPrint, color: 'text-primary', trend: '+12 this week' },
  { label: 'Total Owners', value: 324, icon: Users, color: 'text-secondary', trend: '+5 this week' },
  { label: "Today's Appointments", value: 18, icon: CalendarCheck, color: 'text-accent', trend: '6 pending' },
  { label: 'Low Stock Items', value: 3, icon: PackageX, color: 'text-error', trend: 'Needs attention' },
];

const todaysAppointments = [
  { time: '09:00', pet: 'Max', owner: 'Juan Dela Cruz', type: 'Vaccination', status: 'confirmed' },
  { time: '09:30', pet: 'Luna', owner: 'Maria Santos', type: 'Check-up', status: 'pending' },
  { time: '10:00', pet: 'Coco', owner: 'Ana Reyes', type: 'Deworming', status: 'in-progress' },
  { time: '10:30', pet: 'Bruno', owner: 'Pedro Cruz', type: 'Grooming', status: 'confirmed' },
];

const upcomingVaccinations = [
  { pet: 'Max', vaccine: 'Anti-rabies', due: 'Sep 18', daysLeft: 3 },
  { pet: 'Luna', vaccine: 'Deworming', due: 'Sep 20', daysLeft: 5 },
  { pet: 'Bruno', vaccine: '5-in-1', due: 'Sep 25', daysLeft: 10 },
];

const petTypes = [
  { label: 'Dogs', count: 845, color: 'bg-primary' },
  { label: 'Cats', count: 312, color: 'bg-secondary' },
  { label: 'Birds', count: 54, color: 'bg-accent' },
  { label: 'Others', count: 37, color: 'bg-neutral' },
];
const totalPets = petTypes.reduce((sum, p) => sum + p.count, 0);

const expiringStock = [
  { name: 'Anti-rabies vaccine', expires: 'Oct 10', stock: 5 },
  { name: 'Antibiotic X', expires: 'Oct 20', stock: 12 },
];

const recentActivity = [
  { text: 'Vaccination recorded for Max', time: '10 min ago', icon: Syringe, color: 'text-primary' },
  { text: 'New owner registered: Ana Reyes', time: '32 min ago', icon: Users, color: 'text-secondary' },
  { text: 'Appointment completed for Coco', time: '1 hr ago', icon: CalendarCheck, color: 'text-success' },
  { text: 'Low stock alert: Anti-rabies vaccine', time: '2 hr ago', icon: AlertTriangle, color: 'text-error' },
];

const statusBadge = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  'in-progress': 'badge-info',
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Doctor! 👋</h1>
          <p className="text-sm opacity-60">Here's what's happening at your clinic today.</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h2 className="card-title text-base flex items-center gap-2">
                <Clock size={18} /> Today's Appointments
              </h2>
              <span className="badge badge-ghost">{todaysAppointments.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-xs opacity-60">
                    <th>Time</th>
                    <th>Pet</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAppointments.map((appt) => (
                    <tr key={appt.pet} className="hover">
                      <td className="font-mono text-sm">{appt.time}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-primary/20 text-primary rounded-full w-7">
                              <span className="text-xs">{appt.pet[0]}</span>
                            </div>
                          </div>
                          <span className="font-medium text-sm">{appt.pet}</span>
                        </div>
                      </td>
                      <td className="text-sm opacity-70">{appt.owner}</td>
                      <td className="text-sm">{appt.type}</td>
                      <td>
                        <span className={`badge ${statusBadge[appt.status]} badge-sm capitalize`}>
                          {appt.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pet type breakdown */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <PawPrint size={18} /> Pet Types
            </h2>
            <div className="space-y-3 mt-2">
              {petTypes.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{p.label}</span>
                    <span className="opacity-60">{p.count}</span>
                  </div>
                  <progress
                    className="progress w-full"
                    value={p.count}
                    max={totalPets}
                  />
                </div>
              ))}
            </div>
            <div className="divider my-2" />
            <div className="flex items-center justify-center">
              <div className="radial-progress text-primary" style={{ '--value': 68 }} role="progressbar">
                68%
              </div>
            </div>
            <p className="text-center text-xs opacity-60 mt-1">Dogs make up most of your patients</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Vaccinations */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <Syringe size={18} /> Upcoming Vaccinations
            </h2>
            <ul className="mt-2 space-y-2">
              {upcomingVaccinations.map((v) => (
                <li key={v.pet} className="flex items-center justify-between p-2 rounded-lg bg-base-200/50">
                  <div>
                    <p className="text-sm font-medium">{v.pet}</p>
                    <p className="text-xs opacity-60">{v.vaccine}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-60">{v.due}</p>
                    <span className="badge badge-outline badge-xs">{v.daysLeft}d left</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expiring stock */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Expiring Soon
            </h2>
            <div className="space-y-2 mt-2">
              {expiringStock.map((item) => (
                <div key={item.name} className="alert alert-warning py-2 px-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs opacity-70">Expires {item.expires} · Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <Bell size={18} /> Recent Activity
            </h2>
            <ul className="mt-2 space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`${a.color} bg-base-200 rounded-full p-1.5 mt-0.5`}>
                    <a.icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs opacity-50">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Revenue placeholder */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-success" /> Monthly Revenue
            </h2>
            <button className="btn btn-ghost btn-xs gap-1">
              <FileText size={14} /> View Report
            </button>
          </div>
          <p className="text-3xl font-bold mt-2">₱ 128,450</p>
          <p className="text-xs opacity-60">+8.2% compared to last month</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;