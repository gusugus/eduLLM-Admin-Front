import { useEffect } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

export default function TutorPage() {
  useEffect(() => {
    const tutorUrl = `${GATEWAY}/tutor`;
    window.location.href = tutorUrl;
  }, []);

  return <LoadingScreen message="Redirigiendo al tutor virtual..." />;
}
