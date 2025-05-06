import { FC, useEffect, useRef, useState } from 'react';
import { AppProvider } from './context';
import { I_searchActionHook, I_user } from './types';
import { Header } from './components/header';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Suggestions from './pages/suggestions';
import MyShift from './pages/my-shift';
import useBottomMenu from './components/useBottomMenu';
import usePopup from 'aio-popup';
import { useSidemenu } from './components/sidemenu';
import { Apis } from './apis';
import ReTry from './components/re-try';
import { CreateInstance } from 'aio-apis';
import AmariReport from './pages/amari-report';
import ListiReport from './pages/listi-report';
import AppNameLoader from './components/appnameloader';
import './App.css';
import BoxitAuth from 'boxit-auth';
const SplashScreen: FC = () => {
  const [splash, setSplash] = useState<boolean>(true)
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  if (splash) { return <AppNameLoader /> }
  return (
    <BoxitAuth
      base_url={import.meta.env.VITE_BASE_URL} 
      logout_url={import.meta.env.VITE_LOGOUT} 
      Comp={App}
    />
  )
}
export default SplashScreen
const App: FC<{ logout: any, user: I_user,token:string,base_url:string }> = ({ logout, user,token,base_url }) => {
  debugger
  // const storageRef = useRef(new Storage('drivertoken'))
  // const storage = storageRef.current
  // const tokenRef = useRef(storage.load('token'));
  // const token = tokenRef.current
  const apis = CreateInstance(new Apis({ token, base_url, logout,driverId:user.id }))
  const [retry, setretry] = useState<{ onClick: () => void, text: string } | false>(false)
  const popup = usePopup()
  // const user: I_user = {
  //   username: 'ali_ansari',
  //   id: 788,
  //   name: 'علی انصاری',
  //   hub: { id: 1, text: 'هاب تهران' },
  //   isActive: true
  // }
  const successMessage = (text: string, subtext?: string) => {
    popup.addSnackebar({
      text, subtext, type: 'success'
    })
  }
  const bottomMenuHook = useBottomMenu()
  const sidemenuHook = useSidemenu({ popup })
  const searchAction = useSearchAction()
  return (
    <AppProvider value={{ user, searchAction, bottomMenuHook, sidemenuHook, apis, successMessage, popup, setretry, logout }}>
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
        <Route path='/statisticalreport' element={<AmariReport />} />
        <Route path='/listreport' element={<ListiReport />} />

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