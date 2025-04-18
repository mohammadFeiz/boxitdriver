import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
//import AuthProvider from './utils/auth-provider.tsx'
import oidcConfig from './utils/oidc-config.ts';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <AuthProvider {...oidcConfig}> */}
      <App />
    {/* </AuthProvider> */}
  </BrowserRouter>
)
