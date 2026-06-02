import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import assignmentService from '../../../services/assignmentService';

const PROF_KEY = 'assignments-professor';
const STUD_KEY = 'assignments-student';

export const useAssignments = () => {
  const queryClient = useQueryClient();

  // ─── Profesor ↔ Materia ─────────────────────────────

  const professorAssignmentsQuery = useQuery({
    queryKey: [PROF_KEY],
    queryFn: () => assignmentService.listProfessorSubjects(),
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
    queryKey: [STUD_KEY],
    queryFn: () => assignmentService.listStudentSubjects(),
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

    studentAssignments: studentAssignmentsQuery.data,
    isLoadingStud: studentAssignmentsQuery.isLoading,
    assignStudents: assignStudentsMutation,
    removeStudentAssignment: removeStudentMutation,
  };
};
