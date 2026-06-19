import api from './api';

export const professorService = {
  getAll: (params = {}) => api.get('/professors', { params })
                    .then(res => ({
                      data: res.data.data || [],
                      pagination: res.data.pagination || null,
                    }))
                    .catch(err => {
                      console.error('Error fetching professors:', err);
                      return { data: [], pagination: null };
                    }),
  getActive: () => api.get('/professors', { params: { all: true } })
                    .then(res => res.data.data || [])
                    .catch(() => []),
  getById: (id) => api.get(`/professors/${id}`)
                      .then(res => res.data.data|| [])
                      .catch(err => {
                      console.error('Error fetching professors:', err);
                      return [];
                    }),
  create: (data) => api.post('/professors', data)
                      .then(res => res.data),
  update: (id, data) => api.put(`/professors/${id}`, data)
                      .then(res => res.data),
  delete: (id) => api.delete(`/professors/${id}`)
                      .then(res => res.data),
};

export default professorService;
