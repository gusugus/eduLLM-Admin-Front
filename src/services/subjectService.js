import api from './api';

export const subjectService = {
  getAll: (params = {}) => api.get('/subjects', { params })
                    .then(res => ({
                      data: res.data.data || [],
                      pagination: res.data.pagination || null,
                    }))
                    .catch(err => {
                      console.error('Error fetching subjects:', err);
                      return { data: [], pagination: null };
                    }),
  getActive: () => api.get('/subjects', { params: { all: true } })
                    .then(res => res.data.data || [])
                    .catch(() => []),
  getById: (id) => api.get(`/subjects/${id}`)
                      .then(res => res.data.data || [])
                      .catch(err => {
                        console.error('Error fetching subject:', err);
                        return [];
                      }),
  create: (data) => api.post('/subjects', data)
                        .then(res => res.data),
  update: (id, data) => api.put(`/subjects/${id}`, data)
                          .then(res => res.data),
  delete: (id) => api.delete(`/subjects/${id}`)
                      .then(res => res.data),
};

export default subjectService;
