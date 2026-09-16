import { NavLink } from 'react-router-dom';
import { PawPrint, LogOut } from 'lucide-react';
import { navItems } from '../config/navigation';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-60 bg-slate-800 text-slate-100 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <PawPrint size={24} className="text-primary" />
        <span className="text-xl font-bold">VetCare</span>
      </div>

      <ul className="menu flex-1 gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg ${
                  isActive ? 'bg-primary text-primary-content' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        onClick={onLogout}
        className="btn btn-ghost justify-start gap-2 mt-2 text-slate-300 hover:text-white hover:bg-slate-700"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;