import api from './api';

export const inventoryService = {
  getAll: (params) => api.get('/inventory', { params }).then((r) => r.data),
  getById: (id) => api.get(`/inventory/${id}`).then((r) => r.data),
  getSummary: () => api.get('/inventory/summary').then((r) => r.data),
  getLowStock: () => api.get('/inventory/low-stock').then((r) => r.data),
  getExpiring: (days) => api.get('/inventory/expiring', { params: { days } }).then((r) => r.data),
  getExpired: () => api.get('/inventory/expired').then((r) => r.data),
  create: (data) => api.post('/inventory', data).then((r) => r.data),
  update: (id, data) => api.put(`/inventory/${id}`, data).then((r) => r.data),
  deactivate: (id) => api.delete(`/inventory/${id}`).then((r) => r.data),
  stockIn: (id, data) => api.post(`/inventory/${id}/stock-in`, data).then((r) => r.data),
  stockOut: (id, data) => api.post(`/inventory/${id}/stock-out`, data).then((r) => r.data),
  adjust: (id, data) => api.post(`/inventory/${id}/adjust`, data).then((r) => r.data),
  getTransactions: (id) => api.get(`/inventory/${id}/transactions`).then((r) => r.data),
};