import { createContext, FC, ReactNode, useContext } from "react";
import { I_consignment, I_consignmentHook, I_priorityType } from "../../types";
import { I_usePopup } from "aio-popup";
import { I_homeModalHook } from "./useHomeModal";
type I_HomeContext = {
    popup:I_usePopup,
    arriveToDestinationButton:(consignments:I_consignment[],multiple:boolean)=>void,
    consignmentHook:I_consignmentHook,
    navigationButtonClick:(consignments:I_consignment[],multiple:boolean)=>void,
    priorityButtonClick:(type:I_priorityType)=>void,
    goToNavigate:(consignment:I_consignment)=>void,
    homeModalHook:I_homeModalHook,
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