import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import gradoService from '../../../services/gradoService';

const QUERY_KEY = 'grados';

export const useGrados = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: () => gradoService.getAll({ page, limit, search }),
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

  const activateMutation = useMutation({
    mutationFn: (id) => gradoService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    useGradoById,
    createGrado: createMutation,
    updateGrado: updateMutation,
    deleteGrado: deleteMutation,
    activateGrado: activateMutation,
  };
};
