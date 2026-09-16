export const useDashboardStats = () => {
  const stats = [
    { label: 'Total Pets', value: 1248, trend: '+12 this week' },
    { label: 'Total Owners', value: 324, trend: '+5 this week' },
    { label: "Today's Appointments", value: 18, trend: '6 pending' },
    { label: 'Low Stock Items', value: 3, trend: 'Needs attention' },
  ];

  const todaysAppointments = [
    { time: '09:00', pet: 'Max', owner: 'Juan Dela Cruz', type: 'Vaccination', status: 'confirmed' },
    { time: '09:30', pet: 'Luna', owner: 'Maria Santos', type: 'Check-up', status: 'pending' },
    { time: '10:00', pet: 'Coco', owner: 'Ana Reyes', type: 'Deworming', status: 'in-progress' },
    { time: '10:30', pet: 'Bruno', owner: 'Pedro Cruz', type: 'Grooming', status: 'confirmed' },
  ];

  const upcomingVaccinations = [
    { pet: 'Max', vaccine: 'Anti-rabies', due: 'Sep 18', daysLeft: 3 },
    { pet: 'Luna', vaccine: 'Deworming', due: 'Sep 20', daysLeft: 5 },
    { pet: 'Bruno', vaccine: '5-in-1', due: 'Sep 25', daysLeft: 10 },
  ];

  const petTypes = [
    { label: 'Dogs', count: 845 },
    { label: 'Cats', count: 312 },
    { label: 'Birds', count: 54 },
    { label: 'Others', count: 37 },
  ];

  return { stats, todaysAppointments, upcomingVaccinations, petTypes };
};