import api from './api';

export const subjectService = {
  getAll: () => api.get('/subjects')
                    .then(res => res.data.data || [])
                    .catch(err => {
                      console.error('Error fetching subjects:', err);
                      return [];
                    }),
  getById: (id) => api.get(`/subjects/${id}`)
                      .then(res => res.data.data || [])
                      .catch(err => {
                        console.error('Error fetching subject:', err);
                        return [];
                      }),
  create: (data) => api.post('/subjects', data)
                        .then(res => res.data.data || [])
                        .catch(err => {
                          console.error('Error creating subject:', err);
                          return [];
                        }),
  update: (id, data) => api.put(`/subjects/${id}`, data)
                          .then(res => res.data.data || [])
                          .catch(err => {
                            console.error('Error updating subject:', err);
                            return [];
                          }),
  delete: (id) => api.delete(`/subjects/${id}`)
                      .then(res => res.data || [])
                      .catch(err => {
                        console.error('Error deleting subject:', err);
                        return [];
                      }),
};

export default subjectService;
