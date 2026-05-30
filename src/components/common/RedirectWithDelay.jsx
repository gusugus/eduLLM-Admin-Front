import React, { useEffect, useState } from 'react';

function RedirectWithDelay({ to, message, delay = 2000 }) {
  const [countdown, setCountdown] = useState(delay / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => { window.location.href = to; }, delay);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [to, delay]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{message}</div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...
      </div>
      <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
        Si no es redirigido automáticamente, <a href={to}>haz clic aquí</a>
      </div>
    </div>
  );
}

export default RedirectWithDelay;
