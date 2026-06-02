import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import gradoService from '../../../services/gradoService';

const QUERY_KEY = 'grados';

export const useGrados = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => gradoService.getAll(),
    retry: 1,
    enabled: enableList,
  });

  const useGradoById = (id) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => gradoService.getById(id),
      enabled: !!id,
      retry: 1,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData) => gradoService.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => gradoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => gradoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    useGradoById,
    createGrado: createMutation,
    updateGrado: updateMutation,
    deleteGrado: deleteMutation,
  };
};
