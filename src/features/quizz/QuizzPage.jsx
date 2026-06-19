import { useEffect } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

export default function QuizzPage() {
  useEffect(() => {
    const quizzUrl = `${GATEWAY}/quiz`;
    window.location.href = quizzUrl;
  }, []);

  return <LoadingScreen message="Redirigiendo al generador de quizzes..." />;
}
