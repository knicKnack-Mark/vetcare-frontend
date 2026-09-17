import api from './api';

const localPets = [];

const demoNames = [
  ['Max', 'Golden Retriever', 'Dog', 'Male', 'Juan Dela Cruz', '09171234567'],
  ['Luna', 'Persian', 'Cat', 'Female', 'Maria Santos', '09181234567'],
  ['Bruno', 'Poodle', 'Dog', 'Male', 'Pedro Reyes', '09201234567'],
  ['Coco', 'Shih Tzu', 'Dog', 'Female', 'Ana Reyes', '09211234567'],
  ['Mochi', 'Siamese', 'Cat', 'Male', 'Juan Dela Cruz', '09171234567'],
];

export const getDemoPetProfile = (id) => {
  const index = Math.max(0, Number.parseInt(id?.replace('PET-', ''), 10) - 1) || 0;
  const [name, breed, type, sex, owner, contact] = demoNames[index % demoNames.length];
  const suffix = index < demoNames.length ? '' : ` ${index + 1}`;

  return {
    id: id || 'PET-000001', name: `${name}${suffix}`, breed, type, sex,
    birthDate: '2023-05-10', age: '3y', status: 'active', medicalStatus: index % 9 === 0 ? 'under_treatment' : 'healthy',
    furparent: { name: owner, contact },
    vaccinationStatus: index % 5 === 1 ? 'overdue' : 'up_to_date',
    dewormingStatus: index % 4 === 0 ? 'due_soon' : 'up_to_date',
    antiRabiesStatus: index % 7 === 0 ? 'due_soon' : 'up_to_date',
    vaccinationHistory: [
      { date: '2026-06-12', vaccine: '5-in-1 Vaccine', dose: 'Annual booster', veterinarian: 'Dr. Santos', status: 'Completed' },
      { date: '2025-06-12', vaccine: '5-in-1 Vaccine', dose: 'Annual booster', veterinarian: 'Dr. Reyes', status: 'Completed' },
    ],
    dewormingHistory: [
      { date: '2026-07-10', product: 'Pyrantel Pamoate', dosage: '10 mg/kg', veterinarian: 'Dr. Santos', status: 'Completed' },
      { date: '2026-01-10', product: 'Pyrantel Pamoate', dosage: '10 mg/kg', veterinarian: 'Dr. Reyes', status: 'Completed' },
    ],
    antiRabiesHistory: [
      { date: '2025-09-18', vaccine: 'Anti-rabies vaccine', nextDue: '2026-09-18', veterinarian: 'Dr. Santos', status: 'Due soon' },
    ],
    consultations: [
      { date: '2026-09-10', reason: 'Annual wellness examination', diagnosis: 'Healthy, normal vital signs', veterinarian: 'Dr. Santos' },
      { date: '2026-05-04', reason: 'Skin irritation', diagnosis: 'Mild allergic dermatitis', veterinarian: 'Dr. Reyes' },
    ],
  };
};

export const petService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/pets', { params });
      return response.data;
    } catch {
      return localPets;
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/pets/${id}`);
      return response.data;
    } catch {
      return localPets.find((pet) => pet.id === id) || null;
    }
  },
  async create(payload) {
    const response = await api.post('/pets', payload);
    return response.data;
  },
};
