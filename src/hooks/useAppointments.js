import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getAppointments({
        page, limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
        appointmentType: appointmentType || undefined,
      });
      setAppointments(res.data.appointments);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, appointmentType]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status, appointmentType]);

  const changeStatus = async (appt, newStatus) => {
    try {
      await appointmentService.updateStatus(appt._id, newStatus);
      toast.success(`Appointment marked as ${newStatus.replace('_', ' ')}`);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return {
    appointments, pagination, loading, error,
    search, setSearch, status, setStatus, appointmentType, setAppointmentType,
    page, setPage, changeStatus, refetch: fetchAppointments,
  };
};