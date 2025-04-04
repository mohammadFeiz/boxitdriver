import { createContext, FC, ReactNode, useContext } from "react";
import { I_consignment, I_shift } from "../../types";
import { I_usePopup } from "aio-popup";
type I_MyShiftContext = {
    popup:I_usePopup,
    openDetailsModal:(shift:I_shift)=>void,
    openScanModal:()=>void,
    activeItems:{[id:string]:I_consignment | undefined},
    setActiveItem:(consignment:I_consignment)=>void
}
const MyShiftContext = createContext<I_MyShiftContext>({} as any)
export const MyShiftProvider:FC<{value:I_MyShiftContext,children:ReactNode}> = ({value,children})=>{
    return (
        <MyShiftContext.Provider value={value}>
            {children}
        </MyShiftContext.Provider>
    )
}
export const useMyShiftContext = ()=>useContext(MyShiftContext)