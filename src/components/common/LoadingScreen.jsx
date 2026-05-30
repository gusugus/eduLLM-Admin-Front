import React, { useEffect, useState } from 'react';

function LoadingScreen({ message = 'Cargando...', delay = 500 }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner"></div>
      {showMessage && <div>{message}</div>}
    </div>
  );
}

export default LoadingScreen;
