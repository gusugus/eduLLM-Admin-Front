import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../../../services/studentService';

const QUERY_KEY = 'students';

export const useStudents = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => studentService.getAll(),
    retry: 1,
    enabled: enableList,
  });

  const useStudentById = (id) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => studentService.getById(id),
      enabled: !!id,
      retry: 1,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData) => studentService.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    useStudentById,
    createStudent: createMutation,
    updateStudent: updateMutation,
    deleteStudent: deleteMutation,
  };
};
