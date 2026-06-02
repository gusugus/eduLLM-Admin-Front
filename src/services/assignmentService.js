import api from './api';

export const assignmentService = {
  // Profesor ↔ Materia
  assignProfessorToSubject: (data) => api.post('/assignments/professor-subject', data)
    .then(res => res.data.data)
    .catch(err => { throw err; }),

  listProfessorSubjects: () => api.get('/assignments/professor-subject')
    .then(res => res.data.data || [])
    .catch(() => []),

  removeProfessorSubject: (id) => api.delete(`/assignments/professor-subject/${id}`)
    .then(res => res.data)
    .catch(() => {}),

  // Estudiante ↔ Materia
  assignStudentsToSubject: (data) => api.post('/assignments/student-subject', data)
    .then(res => res.data.data)
    .catch(err => { throw err; }),

  listStudentSubjects: () => api.get('/assignments/student-subject')
    .then(res => res.data.data || [])
    .catch(() => []),

  removeStudentSubject: (id) => api.delete(`/assignments/student-subject/${id}`)
    .then(res => res.data)
    .catch(() => {}),
};

export default assignmentService;
