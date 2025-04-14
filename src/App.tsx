import { FC, useEffect, useRef, useState } from 'react'
import { AppProvider } from './context'
import { I_searchActionHook, I_user } from './types'
import { Header } from './components/header'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Suggestions from './pages/suggestions';
import MyShift from './pages/my-shift';
import { AIOInputDefaults } from 'aio-input';
import checkIcon from './components/checkIcon';
import useBottomMenu from './components/useBottomMenu';
import './App.css'
import usePopup from 'aio-popup';
import { useSidemenu } from './components/sidemenu';
import { Apis } from './apis';
import ReTry from './components/re-try';
import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();

//   useEffect(() => {
//     if (!auth.isLoading && !auth.isAuthenticated && !auth.error) {
//       auth.signinRedirect();
//     }
//   }, [auth.isLoading, auth.isAuthenticated, auth.error]);

//   if (auth.isLoading) return <p>Loading...</p>;
//   if (auth.error) return <p>Error: {auth.error.message}</p>;
//   if (!auth.isAuthenticated) return <p>Redirecting to login...</p>;

//   return (
//     <div>
//       <h1>Welcome, {auth.user?.profile.name || 'User'}!</h1>
//       <button onClick={() => auth.signoutRedirect()}>
//         Logout
//       </button>
//     </div>
//   );
// }
// export default App
const App: FC = () => {
  const token = 'eyJraWQiOiI0ODVkOTNkZC0yODc1LTQzNmQtYWEzNS0xZWY5YjNmMmY2MDQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiLmFtaXJob3NlaW5pIiwicm9sZSI6WyIxNzA4MTg0Njk4ODcwNDIxIl0sImlzcyI6Imh0dHA6XC9cL2JveGk6MjAwMDAiLCJtb2JpbGUiOiIwOTIxMjE1MjY4NyIsInBsYXRmb3JtIjoiUExBVEZPUk1fQURNSU4iLCJzdXAiOiJ5ZXMiLCJhdWQiOiJnYXRld2F5LWNsaWVudC1pZCIsIm5iZiI6MTc0NDYxOTgwMCwic2NvcGUiOlsicHJvZmlsZSJdLCJpZCI6IjI0IiwiZXhwIjoxNzQ0NzA2MjAwLCJpYXQiOjE3NDQ2MTk4MDAsInVzZXJuYW1lIjoiYi5hbWlyaG9zZWluaSIsInN0YXR1cyI6IkVOQUJMRSJ9.gaHMcr8PjtPquTvdlLoM5fUbIRNJ93KhrsCG1m_vOVndh1HB2J2ZZh2tQYy_D9hwLhVjJBZxypjP0-f_dHa1o6HuXz_jPXlp5z4eCCLRhxpaUcvoCW-PkEU9JVQev10dCETeW0xIW3onH403jnvlekZ7MFveUQHPClaGP0f4OJ2pgGMZuC_6L7UXL_smMvUvZQDEw-kfKecleYfKyTfht_aacTyVKWPLm6e13SANMEb_vz5o0edzq7zBeCMobinYcTCAnEkqJ266E3g9nIhNj_T1Kx6rzgGL-daPp8DUo5XwWfUVOl5f5gJt6X-U2OeiVVPM86TwUUUMLBx0Ob00jw';
  const base_url = import.meta.env.VITE_BASE_URL;
  const [retry, setretry] = useState<{ onClick: () => void, text: string } | false>(false)
  AIOInputDefaults.set({
    checkIcon: checkIcon
  })
  const popup = usePopup()
  const user: I_user = {
    username: 'ali_ansari',
    id: 788,
    name: 'علی انصاری',
    hub: { id: 1, text: 'هاب تهران' },
    isActive: true
  }
  const apis = new Apis({ token, base_url, driverId: user.id })
  const successMessage = (text: string, subtext?: string) => {
    popup.addSnackebar({
      text, subtext, type: 'success'
    })
  }
  const bottomMenuHook = useBottomMenu()
  const sidemenuHook = useSidemenu({ popup })
  const searchAction = useSearchAction()
  return (
    <AppProvider value={{ user, searchAction, bottomMenuHook, sidemenuHook, apis, successMessage, popup, setretry }}>
      <div className="app">
        <Header />
        <Body />
        {bottomMenuHook.render()}
        {popup.render()}
      </div>
      {!!retry && <ReTry text={retry.text} onClick={retry.onClick} />}
    </AppProvider>
  )
}

const Body: FC = () => {
  return (
    <div className="app-body">
      <Routes>
        <Route path='/*' element={<Home />} />
        <Route path='/home/*' element={<Home />} />
        <Route path='/suggestions/*' element={<Suggestions />} />
        <Route path='/myshift?*' element={<MyShift />} />
      </Routes>
    </div>
  )
}
const useSearchAction = (): I_searchActionHook => {
  const ref = useRef<any>(() => { })
  const set = (action: any) => ref.current = action
  const click = () => ref.current()
  return { set, click }
}

export default App