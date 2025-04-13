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
  const token = 'eyJraWQiOiI2YjQ2NjA2Yi1kYjg0LTRmNjEtYTg5OS05YTUzYzY5MWQ1NTAiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiLmFtaXJob3NlaW5pIiwicm9sZSI6WyIxNzA4MTg0Njk4ODcwNDIxIl0sImlzcyI6Imh0dHA6XC9cL2JveGk6MjAwMDAiLCJtb2JpbGUiOiIwOTIxMjE1MjY4NyIsInBsYXRmb3JtIjoiUExBVEZPUk1fQURNSU4iLCJzdXAiOiJ5ZXMiLCJhdWQiOiJnYXRld2F5LWNsaWVudC1pZCIsIm5iZiI6MTc0NDUyODI5Miwic2NvcGUiOlsicHJvZmlsZSJdLCJpZCI6IjI0IiwiZXhwIjoxNzQ0NjE0NjkyLCJpYXQiOjE3NDQ1MjgyOTIsInVzZXJuYW1lIjoiYi5hbWlyaG9zZWluaSIsInN0YXR1cyI6IkVOQUJMRSJ9.gNo_BqIk8KbYXZA6BAUcleMHPZBDFZsNQoIXSkf6B_R08obglVZSmZZ0qGOjLjECbvmaYjpT8fyDHZNT8sHjYAXWrKMyxf44xnfQew6hVnzZZrMFq_zQD0cobgT6rAsgj5nwFBcvNDISU-wE-SlZ7KR9YRrmh_g1KvEfz9hN5tmmZI7nmKDwrb1lENmSrZUiB3JMYdEjevO-TShebnSE3V_uWqPfcuAl22vxwFCBD4lTrNaFxRgviCX7ta1KlHnAFKPOsoKpC6VPxe-mS7OGBZaYgSHCSc7HdsJfEwEd5ArAKeNkYQyMPlnoKznyAsW6RPk-s3Xhf9tV8aL6HJa9ew';
  const base_url = import.meta.env.VITE_BASE_URL;
  const [retry, setretry] = useState<{ onClick: () => void, text: string } | false>(false)
  AIOInputDefaults.set({
    checkIcon: checkIcon
  })
  const popup = usePopup()
  const user: I_user = {
    username: 'ali_ansari',
    id:788,
    name: 'علی انصاری',
    hub: { id: 1, text: 'هاب تهران' },
    isActive: true
  }
  const apis = new Apis({ token, base_url,driverId:user.id })
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