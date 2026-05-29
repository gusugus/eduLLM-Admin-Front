import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import professorService from '../../../services/professorService';

const QUERY_KEY = 'professors';

export const useProfessors = ({ enableList = true } = {}) => {  // 🔥 CORREGIDO: objeto con valor por defecto
  const queryClient = useQueryClient();

  // Listar todos (solo se ejecuta si enableList es true)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => professorService.getAll(),
    retry: 1,
    enabled: enableList,  // 🔥 Condición para ejecutar
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
    useProfessorById,
    createProfessor: createMutation,
    updateProfessor: updateMutation,
    deleteProfessor: deleteMutation,
  };
};