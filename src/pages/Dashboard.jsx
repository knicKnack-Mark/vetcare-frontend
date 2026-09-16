import {
  PawPrint, Users, CalendarCheck, PackageX, Syringe, Clock,
  TrendingUp, AlertTriangle, Plus, FileText, Bell,
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import StatCard from '../components/StatCard';

const statIcons = [PawPrint, Users, CalendarCheck, PackageX];
const statColors = ['text-primary', 'text-secondary', 'text-accent', 'text-error'];

const statusBadge = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  'in-progress': 'badge-info',
};

const Dashboard = () => {
  const { stats, todaysAppointments, upcomingVaccinations, petTypes } = useDashboardStats();
  const totalPets = petTypes.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Doctor! 👋</h1>
          <p className="text-sm opacity-60">Here's what's happening at your clinic today.</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={statIcons[i]} color={statColors[i]} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    <th>Time</th><th>Pet</th><th>Owner</th><th>Type</th><th>Status</th>
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
                  <progress className="progress w-full" value={p.count} max={totalPets} />
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

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Expiring Soon
            </h2>
            <div className="space-y-2 mt-2">
              <div className="alert alert-warning py-2 px-3 text-sm">
                <div>
                  <p className="font-medium">Anti-rabies vaccine</p>
                  <p className="text-xs opacity-70">Expires Oct 10 · Stock: 5</p>
                </div>
              </div>
              <div className="alert alert-warning py-2 px-3 text-sm">
                <div>
                  <p className="font-medium">Antibiotic X</p>
                  <p className="text-xs opacity-70">Expires Oct 20 · Stock: 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <Bell size={18} /> Recent Activity
            </h2>
            <ul className="mt-2 space-y-3 text-sm">
              <li>Vaccination recorded for Max <span className="opacity-50 text-xs block">10 min ago</span></li>
              <li>New owner registered: Ana Reyes <span className="opacity-50 text-xs block">32 min ago</span></li>
              <li>Appointment completed for Coco <span className="opacity-50 text-xs block">1 hr ago</span></li>
            </ul>
          </div>
        </div>
      </div>

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