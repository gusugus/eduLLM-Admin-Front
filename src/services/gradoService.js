import api from './api';

export const gradoService = {
  getAll: () => api.get('/grados')
    .then(res => res.data.data || [])
    .catch(err => {
      console.error('Error fetching grados:', err);
      return [];
    }),
  getById: (id) => api.get(`/grados/${id}`)
    .then(res => res.data.data || [])
    .catch(err => {
      console.error('Error fetching grado:', err);
      return [];
    }),
  create: (data) => api.post('/grados', data)
    .then(res => res.data),
  update: (id, data) => api.put(`/grados/${id}`, data)
    .then(res => res.data),
  delete: (id) => api.delete(`/grados/${id}`)
    .then(res => res.data),
};

export default gradoService;
