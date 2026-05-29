import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subjectService from '../../../services/subjectService';

const QUERY_KEY = 'subjects';

export const useSubjects = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => subjectService.getAll(),
    retry: false,
    placeholderData: []
  });

  const createMutation = useMutation({
    mutationFn: (newData) => subjectService.create(newData),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => subjectService.delete(id),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  return {
    data,
    isLoading,
    error,
    createSubjects: createMutation,
    updateSubjects: updateMutation,
    deleteSubjects: deleteMutation,
  };
};