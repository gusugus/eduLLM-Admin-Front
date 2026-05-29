import api from './api';

export const subjectService = {
  getAll: () => api.get('/subjects')
                        .then(res => res.data.data|| [])
                        .catch(err => {
                        console.error('Error fetching subjects:', err);
                        return []; 
                      }),
  getById: (id) => api.get(`/subjects/${id}`)                      
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching subjects:', err);
                        return []; 
                      }),
  create: (data) => api.post('/subjects', data)                      
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching subjects:', err);
                        return []; 
                      }),
  update: (id, data) => api.put(`/subjects/${id}`, data)                      
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching subjects:', err);
                        return []; 
                      }),
  delete: (id) => api.delete(`/subjects/${id}`)                      
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching subjects:', err);
                        return []; 
                      }),
};

export default subjectService;