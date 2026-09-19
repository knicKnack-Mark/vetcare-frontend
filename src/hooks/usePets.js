import { useState, useEffect, useCallback } from 'react';
import { petService } from '../services/petService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ total: 0, dogs: 0, cats: 0, vaccineDue: 0, dewormDue: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('All Types');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await petService.getPets({
        page, limit: 20,
        search: debouncedSearch || undefined,
        petType: petType === 'All Types' ? undefined : petType,
        breed: breed || undefined,
        sex: sex === 'All' ? undefined : sex,
        status: statusFilter === 'All' ? 'all' : statusFilter.toLowerCase(),
      });
      setPets(res.data.pets);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, petType, breed, sex, statusFilter]);

  useEffect(() => { fetchPets(); }, [fetchPets]);
  useEffect(() => { setPage(1); }, [debouncedSearch, petType, breed, sex, statusFilter]);

  const archivePet = async (pet) => {
    try {
      await petService.archive(pet._id);
      toast.success(`${pet.name} archived`);
      fetchPets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive pet');
    }
  };

  const resetFilters = () => {
    setSearch(''); setPetType('All Types'); setBreed(''); setSex('All'); setStatusFilter('active');
  };

  return {
    pets, stats, pagination, loading, error,
    search, setSearch, petType, setPetType, breed, setBreed, sex, setSex,
    statusFilter, setStatusFilter, page, setPage, archivePet, resetFilters, refetch: fetchPets,
  };
};