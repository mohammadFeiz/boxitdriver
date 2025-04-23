import { FC, useEffect, useRef, useState } from 'react';
import { AppProvider } from './context';
import { I_searchActionHook, I_user } from './types';
import { Header } from './components/header';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Suggestions from './pages/suggestions';
import MyShift from './pages/my-shift';
import { AIOInputDefaults } from 'aio-input';
import checkIcon from './components/checkIcon';
import useBottomMenu from './components/useBottomMenu';
import './App.css';
import usePopup from 'aio-popup';
import { useSidemenu } from './components/sidemenu';
import { Apis } from './apis';
import ReTry from './components/re-try';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { CreateInstance } from 'aio-apis';
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
const AuthRouter: FC = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  function logout() {
    window.location.href = import.meta.env.VITE_LOGOUT as string
    auth.removeUser()
    setTimeout(() => {
      window.location.href = import.meta.env.VITE_LOGOUT as string
    }, 200)
  }
  useEffect(() => {
    if(auth.isLoading){return}
    const isAuth = auth.isAuthenticated
    if(!isAuth) {
      auth.signinRedirect();
    }
    else if (auth?.user?.access_token) {
      navigate('/')
      localStorage.setItem("token", auth?.user?.access_token);
    }
  }, [auth]);
  return (
    <Routes>
      <Route path="/Login" element={<div></div>} />
      <Route path='/*' element={<AuthWrapper logout={logout} auth={auth}/>} />
    </Routes>
  )
}
export default AuthRouter
const AuthWrapper:FC<{auth:any,logout:any}> = ({auth,logout})=>{
  if(!auth.isAuthenticated){return null}
  else {
    const token = auth?.user?.access_token;
    localStorage.setItem("token", token);
  }
  return <App logout={logout}/>
}
const App: FC<{logout:any}> = ({logout}) => {
  // const storageRef = useRef(new Storage('drivertoken'))
  // const storage = storageRef.current
  // const tokenRef = useRef(storage.load('token'));
  // const token = tokenRef.current
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
  const token = localStorage.getItem('token') as string
  const apis = CreateInstance(new Apis({ token, base_url, driverId: user.id,logout }))
  const successMessage = (text: string, subtext?: string) => {
    popup.addSnackebar({
      text, subtext, type: 'success'
    })
  }
  const bottomMenuHook = useBottomMenu()
  const sidemenuHook = useSidemenu({ popup })
  const searchAction = useSearchAction()
  return (
    <AppProvider value={{ user, searchAction, bottomMenuHook, sidemenuHook, apis, successMessage, popup, setretry,logout }}>
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
        <Route path='/myshift/*' element={<MyShift />} />
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
