import { AuthProvider } from 'react-oidc-context';
import oidcConfig from './oidc-config';

const MyAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider {...oidcConfig}>
    {children}
  </AuthProvider>
);
export default MyAuthProvider