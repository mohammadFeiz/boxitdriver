import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { BoxitAuthProvider } from 'boxit-auth'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <BoxitAuthProvider
      authority={import.meta.env.VITE_AUTORITY}
      client_id={import.meta.env.VITE_CLIENT_ID}
      redirect_uri={import.meta.env.VITE_REDIRECT_URI}
      client_secret={import.meta.env.VITE_CLIENT_SECRET}
    >
      <App />
    </BoxitAuthProvider>
  </BrowserRouter>
)