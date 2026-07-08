import { useEffect } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import { GATEWAY } from '../../config';

export default function TutorPage() {
  useEffect(() => {
    const tutorUrl = `${GATEWAY}/tutor`;
    window.location.href = tutorUrl;
  }, []);

  return <LoadingScreen message="Redirigiendo al tutor virtual..." />;
}
