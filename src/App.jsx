import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PetsPage from './pages/pets/PetsPage';
import PetCreatePage from './pages/pets/PetCreatePage';
import PetProfilePage from './pages/pets/PetProfilePage';
import PetEditPage from './pages/pets/PetEditPage';
import OwnersPage from './pages/owners/OwnersPage';
import OwnerCreatePage from './pages/owners/OwnerCreatePage';
import OwnerProfilePage from './pages/owners/OwnerProfilePage';
import OwnerEditPage from './pages/owners/OwnerEditPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import AppointmentCreatePage from './pages/appointments/AppointmentCreatePage';
import AppointmentProfilePage from './pages/appointments/AppointmentProfilePage';
import AppointmentEditPage from './pages/appointments/AppointmentEditPage';
import VaccinationsPage from './pages/vaccinations/VaccinationsPage';
import VaccinationCreatePage from './pages/vaccinations/VaccinationCreatePage';
import VaccinationProfilePage from './pages/vaccinations/VaccinationProfilePage';
import VaccinationEditPage from './pages/vaccinations/VaccinationEditPage';
import VaccinationUpcomingPage from './pages/vaccinations/VaccinationUpcomingPage';
import VaccinationOverduePage from './pages/vaccinations/VaccinationOverduePage';
import DewormingsPage from './pages/dewormings/DewormingsPage';
import DewormingCreatePage from './pages/dewormings/DewormingCreatePage';
import DewormingProfilePage from './pages/dewormings/DewormingProfilePage';
import InventoryPage from './pages/inventory/InventoryPage';
import InventoryCreatePage from './pages/inventory/InventoryCreatePage';
import InventoryProfilePage from './pages/inventory/InventoryProfilePage';

import DashboardLayout from './layouts/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />

        <Route path="pets" element={<PetsPage />} />
        <Route path="pets/create" element={<PetCreatePage />} />
        <Route path="pets/:id" element={<PetProfilePage />} />
        <Route path="pets/:id/edit" element={<PetEditPage />} />

        <Route path="owners" element={<OwnersPage />} />
        <Route path="owners/create" element={<OwnerCreatePage />} />
        <Route path="owners/:id" element={<OwnerProfilePage />} />
        <Route path="owners/:id/edit" element={<OwnerEditPage />} />

        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/create" element={<AppointmentCreatePage />} />
        <Route path="appointments/:id" element={<AppointmentProfilePage />} />
        <Route path="appointments/:id/edit" element={<AppointmentEditPage />} />
        
        <Route path="vaccinations" element={<VaccinationsPage />} />
        <Route path="vaccinations/create" element={<VaccinationCreatePage />} />
        <Route path="vaccinations/:id" element={<VaccinationProfilePage />} />

        <Route path="vaccinations/:id/edit" element={<VaccinationEditPage />} />
        <Route path="vaccinations/upcoming" element={<VaccinationUpcomingPage />} />
        <Route path="vaccinations/overdue" element={<VaccinationOverduePage />} />

        <Route path="dewormings" element={<DewormingsPage />} />
        <Route path="dewormings/create" element={<DewormingCreatePage />} />
        <Route path="dewormings/:id" element={<DewormingProfilePage />} />

        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/create" element={<InventoryCreatePage />} />
        <Route path="inventory/:id" element={<InventoryProfilePage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;