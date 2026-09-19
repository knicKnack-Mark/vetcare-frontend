import { useState, useEffect, useCallback } from 'react';
import { vaccinationService } from '../services/vaccinationService';
import { useDebounce } from './useDebounce';

export const useVaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [summary, setSummary] = useState({ total: 0, thisMonth: 0, upcoming: 0, dueToday: 0, overdue: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, summaryRes] = await Promise.all([
        vaccinationService.getAll({ page, limit: 10, search: debouncedSearch || undefined, vaccineType: vaccineType || undefined, status: status || undefined }),
        vaccinationService.getSummary(),
      ]);
      setVaccinations(listRes.data.vaccinations);
      setPagination(listRes.data.pagination);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vaccinations');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, vaccineType, status]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [debouncedSearch, vaccineType, status]);

  return { vaccinations, summary, pagination, loading, error, search, setSearch, vaccineType, setVaccineType, status, setStatus, page, setPage, refetch: fetchData };
};