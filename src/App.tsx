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
import { Storage } from 'aio-utils';
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
const App:FC = ()=>{
  const storageRef = useRef(new Storage('drivertoken'))
  const storage = storageRef.current
  const [token,setToken] = useState<string | undefined>(getToken)
  function getToken(){return storage.load('token')}
  const logout = ()=>{
    const res = window.prompt('inter token');
    if(typeof res === 'string'){
      storage.save('token',res);
      
    }
    window.location.reload()
  }
  useEffect(()=>{
    if(!token){logout()}
  },[])
  if(token){return <APP token={token}/>}
  return null
  
}
const APP: FC<{token:string}> = ({token}) => {
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

export default App