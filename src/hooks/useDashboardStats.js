import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GATEWAY } from '../config';

const fetchStats = async () => {
  let token;

  try {
    const verifyRes = await axios.get(`${GATEWAY}/api/auth/verify`, {
      withCredentials: true,
    });
    token = verifyRes.data?.token;
  } catch {
    // verify may fail, proceed without token
  }

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return axios.get(`${GATEWAY}/api/admin/board-stats`, { headers, withCredentials: true })
    .then(res => res.data.data || {})
    .catch(() => ({}));
};

export const useDashboardStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    stats: data || {},
    isLoading,
  };
};