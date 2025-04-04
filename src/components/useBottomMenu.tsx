import { useLocation, useNavigate } from "react-router-dom"
import { I_bottomMenuHook, I_bottomMenuItem } from "../types"
import * as svgs from './../assets/svgs';
import { useEffect, useState } from "react";

const useBottomMenu = (): I_bottomMenuHook => {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const items: I_bottomMenuItem[] = [
      { text: 'شیفت من', value: 'myshift', icon: <svgs.myshift /> },
      { text: 'پیشنهادها', value: 'suggestions', icon: <svgs.suggestions /> },
      { text: 'خانه', value: 'home', icon: <svgs.home /> },
      { text: 'پروفایل', value: 'profile', icon: <svgs.bottom_menu_profile /> },
    ]
  
    const [active, setActive] = useState<string>(get)
    function get() {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (location.pathname.includes(`/${item.value}`)) { return item.value }
      }
      return 'home'
    }
    useEffect(() => {setActive(get())}, [pathname])
    const set = (value: string) => navigate(`/${value}`)
    const isActive = (value: string) => location.pathname.includes(`/${value}`)
    const renderItem = (item:I_bottomMenuItem,index:number) => {
      return (
        <div key={index} className={`bottom-menu-item${isActive(item.value) ? ' active' : ''}`} onClick={() => set(item.value)}>
          <div className="bottom-menu-item-icon">{item.icon}</div>
          <div className="bottom-menu-item-text">{item.text}</div>
        </div>
      )
    }
    const render = () => {
      return (
        <div className="bottom-menu">{items.map((item, i) => renderItem(item,i))}
        </div>
      )
    }
    return { items, active, set, isActive,render }
  }
  export default useBottomMenu