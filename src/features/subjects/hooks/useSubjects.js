import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subjectService from '../../../services/subjectService';

const QUERY_KEY = 'subjects';

export const useSubjects = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => subjectService.getAll(),
    retry: 1,
    enabled: enableList,
  });

  const useSubjectById = (id) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => subjectService.getById(id),
      enabled: !!id,
      retry: 1,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData) => subjectService.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    useSubjectById,
    createSubject: createMutation,
    updateSubject: updateMutation,
    deleteSubject: deleteMutation,
  };
};
