import { FC, useRef, useState } from 'react'
import { AppProvider } from './context'
import { I_searchActionHook, I_user } from './types'
import { Header } from './components/header'
import { Route, Routes } from 'react-router-dom';
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

const App: FC = () => {
  const token = '';
  const base_url = 'http://myapis.com'
  const [retry, setretry] = useState<{ onClick: () => void, text: string } | false>(false)
  AIOInputDefaults.set({
    checkIcon: checkIcon
  })
  const popup = usePopup()
  const apis = new Apis({ token, base_url })
  const user: I_user = {
    username: 'ali_ansari',
    name: 'علی انصاری',
    hub: { id: 1, text: 'هاب تهران' },
    isActive: true
  }
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
export default App

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