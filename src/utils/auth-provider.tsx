import { AuthProvider } from 'react-oidc-context';
import oidcConfig from './oidc-config';
const onSigninCallback = (_user: any): void => {
  window.history.replaceState({}, document.title, "/");
};

const MyAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
    {children}
  </AuthProvider>
);
export default MyAuthProvider