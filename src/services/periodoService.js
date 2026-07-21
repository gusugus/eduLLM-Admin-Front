import api from './api';

export const periodoService = {
  getAll: (params = {}) => api.get('/periodos', { params })
    .then(res => ({
      data: res.data.data || [],
      pagination: res.data.pagination || null,
    }))
    .catch(err => {
      console.error('Error fetching periodos:', err);
      return { data: [], pagination: null };
    }),
  getActive: () => api.get('/periodos', { params: { all: true } })
    .then(res => res.data.data || [])
    .catch(() => []),
  getById: (id) => api.get(`/periodos/${id}`)
    .then(res => res.data.data || [])
    .catch(err => {
      console.error('Error fetching periodo:', err);
      return [];
    }),
  create: (data) => api.post('/periodos', data)
    .then(res => res.data),
  update: (id, data) => api.put(`/periodos/${id}`, data)
    .then(res => res.data),
  delete: (id) => api.delete(`/periodos/${id}`)
    .then(res => res.data),
  activate: (id) => api.post(`/periodos/${id}/activate`)
    .then(res => res.data),
};

export default periodoService;
