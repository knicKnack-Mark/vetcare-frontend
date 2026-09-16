import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, Users, Calendar, Syringe,
  Package, Receipt, BarChart3, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pets', label: 'Pets', icon: PawPrint },
  { to: '/owners', label: 'Owners', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/vaccinations', label: 'Vaccinations', icon: Syringe },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-60 bg-neutral text-neutral-content flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <PawPrint size={24} />
          <span className="text-xl font-bold">VetCare</span>
        </div>

        <ul className="menu flex-1 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive ? 'active flex items-center gap-2' : 'flex items-center gap-2'
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className="btn btn-ghost justify-start gap-2 mt-2 text-neutral-content">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="navbar bg-base-100 border-b border-base-300 px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-sm leading-none">{user?.name}</p>
              <p className="text-xs opacity-60">{user?.role}</p>
            </div>
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-9">
                <span className="text-sm">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;