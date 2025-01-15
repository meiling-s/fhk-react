import React, { useEffect, useState, useRef } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { createUserActivity } from "../APICalls/userAccount";
import { returnApiToken } from "../utils/utils";
import { UserActivity } from "../interfaces/common";
const ipAddress = localStorage.getItem("ipAddress");

const AutoLogout = () => {
  const [lastActivityTime, setLastActivityTime] = useState<any>(Date.now());
  const checkInactivityRef = useRef<() => void>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkInactivity = () => {
      const inactivityPeriod = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      const currentTime = Date.now();
      const inactivityTime = currentTime - lastActivityTime;

      console.log(`Inactive for ${inactivityTime / 1000} seconds`);
      if (inactivityTime > inactivityPeriod) {
        const { loginId } = returnApiToken();
        if (ipAddress) {
          const userActivity: UserActivity = {
            operation: "登出", // Logout
            ip: ipAddress,
            createdBy: loginId,
            updatedBy: loginId,
          };
          createUserActivity(loginId, userActivity);
        }

        console.log("User has been logged out");
        localStorage.clear();
        navigate("/");
      }
    };

    checkInactivityRef.current = checkInactivity;
  }, [lastActivityTime, navigate]);

  useEffect(() => {
    // console.log('hi')
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

  const events = ["mousedown", "keydown", "mousemove", "scroll", "touchstart"];

  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return <Outlet />;
};

export default AutoLogout;
