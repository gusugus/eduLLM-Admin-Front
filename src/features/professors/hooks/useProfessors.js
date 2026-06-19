import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import professorService from '../../../services/professorService';

const QUERY_KEY = 'professors';

export const useProfessors = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: () => professorService.getAll({ page, limit, search }),
    retry: 1,
    enabled: enableList,
  });

  // Obtener uno por ID (para edición)
  const useProfessorById = (id) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => professorService.getById(id),
      enabled: !!id,
      retry: 1,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData) => professorService.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => professorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => professorService.delete(id),
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
    useProfessorById,
    createProfessor: createMutation,
    updateProfessor: updateMutation,
    deleteProfessor: deleteMutation,
  };
};