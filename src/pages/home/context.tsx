import { createContext, FC, ReactNode, useContext } from "react";
import { I_consignment } from "../../types";
import { I_usePopup } from "aio-popup";
type I_HomeContext = {
    popup:I_usePopup,
    consignments:I_consignment[],
    openDeliveryModal:(consignment:I_consignment)=>void
}
const HomeContext = createContext<I_HomeContext>({} as any)
export const HomeProvider:FC<{value:I_HomeContext,children:ReactNode}> = ({value,children})=>{
    return (
        <HomeContext.Provider value={value}>
            {children}
        </HomeContext.Provider>
    )
}
export const useHomeContext = ()=>useContext(HomeContext)