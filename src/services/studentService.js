import api from './api';

export const studentService = {
  getAll: (params = {}) => api.get('/students', { params })
                    .then(res => ({
                      data: res.data.data || [],
                      pagination: res.data.pagination || null,
                    }))
                    .catch(err => {
                      console.error('Error fetching students:', err);
                      return { data: [], pagination: null };
                    }),
  getActive: () => api.get('/students', { params: { all: true } })
                    .then(res => res.data.data || [])
                    .catch(() => []),
  getById: (id) => api.get(`/students/${id}`)
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return []; 
                      }),
  create: (data) => api.post('/students', data)
                        .then(res => res.data),
  update: (id, data) => api.put(`/students/${id}`, data)
                        .then(res => res.data),
  delete: (id) => api.delete(`/students/${id}`)
                      .then(res => res.data),
  activate: (id) => api.post(`/students/${id}/activate`)
                      .then(res => res.data),
};

export default studentService;