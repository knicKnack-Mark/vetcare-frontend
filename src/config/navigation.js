import {
  LayoutDashboard, PawPrint, Users, Calendar, Syringe,
  Package, Receipt, BarChart3,
} from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pets', label: 'Pets', icon: PawPrint },
  { to: '/owners', label: 'Owners', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/vaccinations', label: 'Vaccinations', icon: Syringe },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dewormings', label: 'Deworming', icon: Syringe },
];