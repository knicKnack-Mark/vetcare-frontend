import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Users, Calendar, Syringe, Package, Receipt, BarChart3, LogOut } from 'lucide-react';
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '220px', background: '#1e293b', color: 'white', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem' }}>🐾 VetCare</h2>
        <nav style={{ flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                color: 'white',
                textDecoration: 'none',
                marginBottom: '0.3rem',
                background: isActive ? '#334155' : 'transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.6rem 0.8rem' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main style={{ flex: 1, background: '#f5f7fa', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          Hello, <strong>{user?.name}</strong> ({user?.role})
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;