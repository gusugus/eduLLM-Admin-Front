import { useEffect } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import { GATEWAY } from '../../config';

export default function QuizzPage() {
  useEffect(() => {
    const quizzUrl = `${GATEWAY}/quiz`;
    window.location.href = quizzUrl;
  }, []);

  return <LoadingScreen message="Redirigiendo al generador de quizzes..." />;
}
