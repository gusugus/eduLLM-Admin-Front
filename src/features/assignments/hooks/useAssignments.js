import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import assignmentService from '../../../services/assignmentService';

const PROF_KEY = 'assignments-professor';
const STUD_KEY = 'assignments-student';

export const useAssignments = (studMateriaId = null) => {
  const queryClient = useQueryClient();
  const [profPage, setProfPage] = useState(1);
  const [profLimit, setProfLimit] = useState(10);
  const [studPage, setStudPage] = useState(1);
  const [studLimit, setStudLimit] = useState(10);

  // ─── Profesor ↔ Materia ─────────────────────────────

  const professorAssignmentsQuery = useQuery({
    queryKey: [PROF_KEY, profPage, profLimit],
    queryFn: () => assignmentService.listProfessorSubjects(profPage, profLimit),
  });

  const assignProfessorMutation = useMutation({
    mutationFn: (data) => assignmentService.assignProfessorToSubject(data),
    onSuccess: () => queryClient.invalidateQueries([PROF_KEY]),
  });

  const removeProfessorMutation = useMutation({
    mutationFn: (id) => assignmentService.removeProfessorSubject(id),
    onSuccess: () => queryClient.invalidateQueries([PROF_KEY]),
  });

  // ─── Estudiante ↔ Materia ───────────────────────────

  const studentAssignmentsQuery = useQuery({
    queryKey: [STUD_KEY, studPage, studLimit, studMateriaId],
    queryFn: () => assignmentService.listStudentSubjects(studPage, studLimit, studMateriaId),
    enabled: !!studMateriaId,
  });

  const assignStudentsMutation = useMutation({
    mutationFn: (data) => assignmentService.assignStudentsToSubject(data),
    onSuccess: () => queryClient.invalidateQueries([STUD_KEY]),
  });

  const removeStudentMutation = useMutation({
    mutationFn: (id) => assignmentService.removeStudentSubject(id),
    onSuccess: () => queryClient.invalidateQueries([STUD_KEY]),
  });

  return {
    professorAssignments: professorAssignmentsQuery.data,
    isLoadingProf: professorAssignmentsQuery.isLoading,
    assignProfessor: assignProfessorMutation,
    removeProfessorAssignment: removeProfessorMutation,
    profPage, profLimit, setProfPage, setProfLimit,

    studentAssignments: studentAssignmentsQuery.data,
    isLoadingStud: studentAssignmentsQuery.isLoading,
    assignStudents: assignStudentsMutation,
    removeStudentAssignment: removeStudentMutation,
    studPage, studLimit, setStudPage, setStudLimit,
  };
};
