import { useState, useMemo } from 'react';
const seedPets = [
  { id: 'PET-000001', name: 'Max', type: 'Dog', breed: 'Golden Retriever', sex: 'Male', birthDate: '2023-05-10', furparent: { name: 'Juan Dela Cruz', contact: '09171234567' }, vaccinationStatus: 'up_to_date', dewormingStatus: 'due_soon', lastVisit: '2026-09-10', status: 'active' },
  { id: 'PET-000002', name: 'Luna', type: 'Cat', breed: 'Persian', sex: 'Female', birthDate: '2024-02-14', furparent: { name: 'Maria Santos', contact: '09181234567' }, vaccinationStatus: 'overdue', dewormingStatus: 'up_to_date', lastVisit: '2026-08-22', status: 'active' },
  { id: 'PET-000003', name: 'Bruno', type: 'Dog', breed: 'Poodle', sex: 'Male', birthDate: '2021-11-01', furparent: { name: 'Pedro Reyes', contact: '09201234567' }, vaccinationStatus: 'up_to_date', dewormingStatus: 'up_to_date', lastVisit: '2026-09-01', status: 'active' },
    { id: 'PET-000004', name: 'Coco', type: 'Dog', breed: 'Shih Tzu', sex: 'Female', birthDate: '2022-06-20', furparent: { name: 'Ana Reyes', contact: '09211234567' }, vaccinationStatus: 'due_soon', dewormingStatus: 'overdue', lastVisit: null, status: 'active' },
  { id: 'PET-000005', name: 'Mochi', type: 'Cat', breed: 'Siamese', sex: 'Male', birthDate: '2023-09-05', furparent: { name: 'Juan Dela Cruz', contact: '09171234567' }, vaccinationStatus: 'up_to_date', dewormingStatus: 'up_to_date', medicalStatus: 'recovered', antiRabiesStatus: 'up_to_date', lastVisit: '2026-09-14', status: 'archived' },
];

const dummyPets = Array.from({ length: 248 }, (_, index) => {
  const seed = seedPets[index % seedPets.length];
  return {
    ...seed,
    id: `PET-${String(index + 1).padStart(6, '0')}`,
    name: index < seedPets.length ? seed.name : `${seed.name} ${index + 1}`,
    status: 'active',
    medicalStatus: seed.medicalStatus || (index % 9 === 0 ? 'under_treatment' : 'healthy'),
    antiRabiesStatus: seed.antiRabiesStatus || (index % 7 === 0 ? 'due_soon' : 'up_to_date'),
  };
});

const calculateAge = (birthDate) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  const years = diff / (1000 * 60 * 60 * 24 * 365.25);
  return years < 1 ? `${Math.round(years * 12)}mo` : `${Math.floor(years)}y`;
};

export const usePets = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sexFilter, setSexFilter] = useState('Gender');
  const [breedFilter, setBreedFilter] = useState('All Breeds');
  const [medicalStatusFilter, setMedicalStatusFilter] = useState('All Medical Statuses');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading] = useState(false);
  const [error] = useState(null);

  const filtered = useMemo(() => {
    return dummyPets.filter((pet) => {
      const matchesSearch =
        !search ||
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.id.toLowerCase().includes(search.toLowerCase()) ||
        pet.furparent.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.furparent.contact.includes(search);

      const matchesType = typeFilter === 'All Types' || pet.type === typeFilter;
      const matchesSex = sexFilter === 'Gender' || pet.sex === sexFilter;
      const matchesBreed = breedFilter === 'All Breeds' || pet.breed === breedFilter;
      const matchesMedicalStatus = medicalStatusFilter === 'All Medical Statuses' || pet.medicalStatus === medicalStatusFilter;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && pet.status === 'active') ||
        (statusFilter === 'Archived' && pet.status === 'archived');

      return matchesSearch && matchesType && matchesSex && matchesBreed && matchesMedicalStatus && matchesStatus;
    });
  }, [search, typeFilter, sexFilter, breedFilter, medicalStatusFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = dummyPets.filter((p) => p.status === 'active');
    return {
      total: active.length,
      dogs: active.filter((p) => p.type === 'Dog').length,
      cats: active.filter((p) => p.type === 'Cat').length,
      vaccineDue: active.filter((p) => p.vaccinationStatus === 'due_soon' || p.vaccinationStatus === 'overdue').length,
      dewormDue: active.filter((p) => p.dewormingStatus === 'due_soon' || p.dewormingStatus === 'overdue').length,
      antiRabiesDue: active.filter((p) => p.antiRabiesStatus === 'due_soon' || p.antiRabiesStatus === 'overdue').length,
    };
  }, []);

  const pets = filtered.slice((page - 1) * pageSize, page * pageSize).map((p) => ({ ...p, age: calculateAge(p.birthDate) }));

  return {
    pets, stats, loading, error,
    search, setSearch,
    typeFilter, setTypeFilter,
    sexFilter, setSexFilter,
    breedFilter, setBreedFilter,
    medicalStatusFilter, setMedicalStatusFilter,
    statusFilter, setStatusFilter,
    page, setPage, pageSize,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    hasRecords: dummyPets.length > 0,
  };
};