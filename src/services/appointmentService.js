import api from './api';

export const appointmentService = {
  getAppointments: (params) => api.get('/appointments', { params }).then((r) => r.data),
  getById: (id) => api.get(`/appointments/${id}`).then((r) => r.data),
  getSummary: () => api.get('/appointments/summary').then((r) => r.data),
  getToday: () => api.get('/appointments/today').then((r) => r.data),
  create: (data) => api.post('/appointments', data).then((r) => r.data),
  update: (id, data) => api.put(`/appointments/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }).then((r) => r.data),
  cancel: (id, reason) => api.post(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),
  reschedule: (id, data) => api.post(`/appointments/${id}/reschedule`, data).then((r) => r.data),
  complete: (id, notes) => api.post(`/appointments/${id}/complete`, { notes }).then((r) => r.data),
  markNoShow: (id) => api.post(`/appointments/${id}/no-show`).then((r) => r.data),
};