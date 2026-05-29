import api from './api';

export const studentService = {
  getAll: () => api.get('/students')
                    .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return [];  
                      }),
  getById: (id) => api.get(`/students/${id}`)
                      .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return []; 
                      }),
  create: (data) => api.post('/students', data)
                        .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return []; 
                      }),
  update: (id, data) => api.put(`/students/${id}`, data)
                        .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return []; 
                      }),
  delete: (id) => api.delete(`/students/${id}`)
                        .then(res => res.data.data|| [])
                      .catch(err => {
                        console.error('Error fetching students:', err);
                        return []; 
                      }),
};

export default studentService;