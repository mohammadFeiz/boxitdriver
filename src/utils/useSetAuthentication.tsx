import { useEffect } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function useSetAuthentication() {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
    }
    else if (auth?.user?.access_token) {    
      localStorage.setItem("token", auth?.user?.access_token);
    }
  }, []);
  return {};
}