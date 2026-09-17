import { useState, useMemo } from 'react';

const dummyOwners = [
  { id: 'OWNER-001', firstName: 'Juan', lastName: 'Dela Cruz', mobileNumber: '09171234567', email: 'juan@email.com', petCount: 3, lastVisit: 'Sep 15', status: 'active' },
  { id: 'OWNER-002', firstName: 'Maria', lastName: 'Santos', mobileNumber: '09271234567', email: 'maria@email.com', petCount: 1, lastVisit: 'Sep 12', status: 'active' },
  { id: 'OWNER-003', firstName: 'Pedro', lastName: 'Reyes', mobileNumber: '09981234567', email: '', petCount: 2, lastVisit: 'Aug 30', status: 'active' },
  { id: 'OWNER-004', firstName: 'Ana', lastName: 'Lopez', mobileNumber: '09201234567', email: 'ana@email.com', petCount: 0, lastVisit: null, status: 'inactive' },
];

export const useOwners = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [loading] = useState(false);
  const [error] = useState(null);

  const owners = useMemo(() => {
    return dummyOwners.filter((o) => {
      const matchesSearch =
        !search ||
        `${o.firstName} ${o.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        o.mobileNumber.includes(search) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return { owners, loading, error, search, setSearch, statusFilter, setStatusFilter, total: dummyOwners.length };
};