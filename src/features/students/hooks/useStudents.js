import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../../../services/studentService';

const QUERY_KEY = 'students';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => studentService.getAll(),
    retry: false,
    placeholderData: []
  });

  const createMutation = useMutation({
    mutationFn: (newData) => studentService.create(newData),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => studentService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => studentService.delete(id),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  return {
    data,
    isLoading,
    error,
    createStudents: createMutation,
    updateStudents: updateMutation,
    deleteStudents: deleteMutation,
  };
};