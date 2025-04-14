import { useEffect } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";

const Login = () => {
  const auth = useAuth();

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading
    ) {
      auth.signinRedirect();
    }
  }, [auth]);

  return <div className="w-full flex justify-center items-center fixed "></div>;
};

export default Login;