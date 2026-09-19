import { useState, useEffect, useCallback } from 'react';
import { ownerService } from '../services/ownerService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const useOwners = () => {
  const [owners, setOwners] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ownerService.getOwners({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        municipality: municipality || undefined,
        province: province || undefined,
        preferredContactMethod: contactMethod || undefined,
        sortBy,
        sortOrder,
      });
      setOwners(res.data.owners);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load owners');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, municipality, province, contactMethod, sortBy, sortOrder]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, municipality, province, contactMethod, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleStatus = async (owner) => {
    const newStatus = owner.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await ownerService.updateStatus(owner._id, newStatus);
      toast.success(res.message || 'Status updated');
      fetchOwners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('active');
    setMunicipality('');
    setProvince('');
    setContactMethod('');
    setSortBy('lastName');
    setSortOrder('asc');
  };

  return {
    owners, pagination, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    municipality, setMunicipality,
    province, setProvince,
    contactMethod, setContactMethod,
    sortBy, sortOrder, toggleSort,
    page, setPage, toggleStatus, refetch: fetchOwners, resetFilters,
  };
};