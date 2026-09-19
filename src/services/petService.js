import api from './api';

export const petService = {
  getPets: (params) => api.get('/pets', { params }).then((r) => r.data),
  getById: (id) => api.get(`/pets/${id}`).then((r) => r.data),
  create: (data) => api.post('/pets', data).then((r) => r.data),
  update: (id, data) => api.put(`/pets/${id}`, data).then((r) => r.data),
  archive: (id) => api.patch(`/pets/${id}/archive`).then((r) => r.data),
  restore: (id) => api.patch(`/pets/${id}/restore`).then((r) => r.data),
};