import { Navigate, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch((e) => {
      console.error(e);
      console.log("Token auth failed");
      setIsAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);

    try {
      const response = await api.post("/auth/token/refresh/", {
        refresh: refresh_token,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthorized(true);
        console.log("Token refresh successful");
      }
    } catch (error) {
      console.error(error);
      console.log("Token refresh failed");
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.log("No token");
      setIsAuthorized(false);
      return;
    }

    const { exp } = jwtDecode(token);

    if (Date.now() >= exp * 1000) {
      await refreshToken();
      console.log("Token refresh successful");
    } else {
      console.log("Token expired");
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (isAuthorized === true) {
    console.log("Authorized");
  } else {
    console.log("Not Authorized");
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
