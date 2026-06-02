import api from './api';

export const professorService = {
  getAll: () => api.get('/professors').
                    then(res => res.data.data|| []).
                    catch(err => {
                      console.error('Error fetching professors:', err);
                      return [];
                    }),
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