import { createContext, FC, ReactNode, useContext } from "react"
import { I_bottomMenuHook, I_bottomMenuItem, I_searchActionHook, I_sidemenuHook, I_user } from "./types"

export type I_AppContext = {
    user:I_user,
    bottomMenuHook:I_bottomMenuHook,
    sidemenuHook:I_sidemenuHook,
    searchAction:I_searchActionHook
}
const AppContext = createContext<I_AppContext>({} as any)
export const AppProvider:FC<{value:I_AppContext,children:ReactNode}> = ({value,children})=>{
    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}
export const useAppContext = ()=>useContext(AppContext)