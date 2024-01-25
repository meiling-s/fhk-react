import React, { useEffect, useState, useRef } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const [lastActivityTime, setLastActivityTime] = useState<any>(Date.now());
  const checkInactivityRef = useRef<() => void>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkInactivity = () => {
      const inactivityPeriod = 10 *60 *1000; // 10 seconds
      const currentTime = Date.now();
      const inactivityTime = currentTime - lastActivityTime;

      console.log(`Inactive for ${inactivityTime / 1000} seconds`);
      if (inactivityTime > inactivityPeriod) {
        console.log('User has been logged out');
        localStorage.clear()
        navigate('/'); 
      }
    };
     
    checkInactivityRef.current = checkInactivity;
  }, [lastActivityTime, navigate]);

  useEffect(() => {
    console.log('hi')
    const checkInterval = setInterval(() => {
      checkInactivityRef.current?.();
    }, 60000); // Check every second

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const resetTimer = () => {
    setLastActivityTime(Date.now());
  };

  const events = ['mousedown', 'keydown', 'mousemove', 'scroll', 'touchstart'];

  useEffect(() => {
 
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return <Outlet />
};

export default AutoLogout;