import api from './api';

export const vaccinationService = {
  getAll: (params) => api.get('/vaccinations', { params }).then((r) => r.data),
  getById: (id) => api.get(`/vaccinations/${id}`).then((r) => r.data),
  getSummary: () => api.get('/vaccinations/summary').then((r) => r.data),
  getUpcoming: (days) => api.get('/vaccinations/upcoming', { params: { days } }).then((r) => r.data),
  getOverdue: () => api.get('/vaccinations/overdue').then((r) => r.data),
  create: (data) => api.post('/vaccinations', data).then((r) => r.data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data).then((r) => r.data),
  void: (id, reason) => api.delete(`/vaccinations/${id}`, { data: { reason } }).then((r) => r.data),
};