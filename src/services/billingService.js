import api from './api';

export const billingService = {
  getAll: (params) => api.get('/billing', { params }).then((r) => r.data),
  getById: (id) => api.get(`/billing/${id}`).then((r) => r.data),
  getSummary: () => api.get('/billing/summary').then((r) => r.data),
  getUnpaid: () => api.get('/billing/unpaid').then((r) => r.data),
  getPartial: () => api.get('/billing/partial').then((r) => r.data),
  create: (data) => api.post('/billing', data).then((r) => r.data),
  update: (id, data) => api.put(`/billing/${id}`, data).then((r) => r.data),
  finalize: (id) => api.post(`/billing/${id}/finalize`).then((r) => r.data),
  addPayment: (id, data) => api.post(`/billing/${id}/payments`, data).then((r) => r.data),
  void: (id, reason, returnInventory) => api.post(`/billing/${id}/void`, { reason, returnInventory }).then((r) => r.data),
  refund: (id, data) => api.post(`/billing/${id}/refund`, data).then((r) => r.data),
};