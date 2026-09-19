import api from './api';

export const ownerService = {
  getOwners: (params) => api.get('/owners', { params }).then((r) => r.data),
  getOwnerById: (id) => api.get(`/owners/${id}`).then((r) => r.data),
  createOwner: (data) => api.post('/owners', data).then((r) => r.data),
  updateOwner: (id, data) => api.put(`/owners/${id}`, data).then((r) => r.data),
  patchOwner: (id, data) => api.patch(`/owners/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/owners/${id}/status`, { status }).then((r) => r.data),
  getOwnerPets: (id) => api.get(`/owners/${id}/pets`).then((r) => r.data),
  getOwnerSummary: (id) => api.get(`/owners/${id}/summary`).then((r) => r.data),
  searchOwners: (q) => api.get('/owners/search', { params: { q } }).then((r) => r.data),
};