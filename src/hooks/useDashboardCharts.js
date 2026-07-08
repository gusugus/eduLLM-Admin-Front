import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GATEWAY } from '../config';

const fetchCharts = async ({ periodo, estudianteId } = {}) => {
  let token;
  try {
    const verifyRes = await axios.get(`${GATEWAY}/api/auth/verify`, {
      withCredentials: true,
    });
    token = verifyRes.data?.token;
  } catch {
    // proceed without token
  }

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const params = {};
  if (periodo) params.periodo = periodo;
  if (estudianteId) params.estudianteId = estudianteId;

  return axios
    .get(`${GATEWAY}/api/admin/board-charts`, { headers, withCredentials: true, params })
    .then(res => res.data.data || {})
    .catch(() => ({}));
};

const EMPTY = { profesorRanking: [], rendimientoGrado: [], distribucionPuntajes: [] };

export const useDashboardCharts = ({ periodo, estudianteId } = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-charts', periodo ?? '', estudianteId ?? ''],
    queryFn: () => fetchCharts({ periodo, estudianteId }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    charts: data || EMPTY,
    isLoading,
  };
};
