import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return handleLogout;
};