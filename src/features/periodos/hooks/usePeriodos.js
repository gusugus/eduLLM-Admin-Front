import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import periodoService from '../../../services/periodoService';

const QUERY_KEY = 'periodos';

export const usePeriodos = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: () => periodoService.getAll({ page, limit, search }),
    retry: 1,
    enabled: enableList,
  });

  const usePeriodoById = (id) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => periodoService.getById(id),
      enabled: !!id,
      retry: 1,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData) => periodoService.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => periodoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => periodoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id) => periodoService.activate(id),
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
    usePeriodoById,
    createPeriodo: createMutation,
    updatePeriodo: updateMutation,
    deletePeriodo: deleteMutation,
    activatePeriodo: activateMutation,
  };
};
