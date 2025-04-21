import { createContext, FC, ReactNode, useContext } from "react"
import { I_bottomMenuHook, I_searchActionHook, I_sidemenuHook, I_user } from "./types"
import { Apis } from "./apis"
import { I_usePopup } from "aio-popup"

export type I_AppContext = {
    user:I_user,
    bottomMenuHook:I_bottomMenuHook,
    sidemenuHook:I_sidemenuHook,
    searchAction:I_searchActionHook,
    apis:Apis,
    successMessage:(text:string,subtext?:string)=>void,
    popup:I_usePopup,
    setretry:(v:{ onClick: () => void, text: string } | false)=>void,
    logout:any
}
const AppContext = createContext<I_AppContext>({} as any)
export const AppProvider:FC<{value:I_AppContext,children:ReactNode}> = ({value,children})=>{
    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}
export const useAppContext = ()=>useContext(AppContext)