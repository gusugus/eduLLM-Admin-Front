import api from './api';

export const gradoService = {
  getAll: (params = {}) => api.get('/grados', { params })
    .then(res => ({
      data: res.data.data || [],
      pagination: res.data.pagination || null,
    }))
    .catch(err => {
      console.error('Error fetching grados:', err);
      return { data: [], pagination: null };
    }),
  getActive: () => api.get('/grados', { params: { all: true } })
    .then(res => res.data.data || [])
    .catch(() => []),
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
  activate: (id) => api.post(`/grados/${id}/activate`)
    .then(res => res.data),
};

export default gradoService;
