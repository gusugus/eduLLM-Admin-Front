import api from './api';

export const assignmentService = {
  // Profesor ↔ Materia
  assignProfessorToSubject: (data) => api.post('/assignments/professor-subject', data)
    .then(res => res.data.data)
    .catch(err => { throw err; }),

  listProfessorSubjects: (page = 1, limit = 10) => api.get('/assignments/professor-subject', { params: { page, limit } })
    .then(res => ({ data: res.data.data || [], pagination: res.data.pagination || null }))
    .catch(() => ({ data: [], pagination: null })),

  removeProfessorSubject: (id) => api.delete(`/assignments/professor-subject/${id}`)
    .then(res => res.data)
    .catch(() => {}),

  // Estudiante ↔ Materia
  assignStudentsToSubject: (data) => api.post('/assignments/student-subject', data)
    .then(res => res.data.data)
    .catch(err => { throw err; }),

  listStudentSubjects: (page = 1, limit = 10, id_materia = null) => api.get('/assignments/student-subject', { params: { page, limit, id_materia } })
    .then(res => ({ data: res.data.data || [], pagination: res.data.pagination || null }))
    .catch(() => ({ data: [], pagination: null })),

  getStudentIdsByMateria: (materiaId) => api.get('/assignments/student-subject', { params: { all: true, id_materia: materiaId } })
    .then(res => (res.data.data || []).map(a => a.id_estudiante))
    .catch(() => []),

  removeStudentSubject: (id) => api.delete(`/assignments/student-subject/${id}`)
    .then(res => res.data)
    .catch(() => {}),
};

export default assignmentService;
