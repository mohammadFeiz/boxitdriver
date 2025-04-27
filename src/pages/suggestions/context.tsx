import { createContext, FC, ReactNode, useContext } from "react";
import { I_shift } from "../../types";
import { I_usePopup } from "aio-popup";
type I_SuggestionsContext = {
    openShiftModal:(suggestion: I_shift) => void,
    acceptShift:(shift: I_shift) => Promise<void>,
    popup:I_usePopup
}
const SuggestionsContext = createContext<I_SuggestionsContext>({} as any)
export const SuggestionProvider:FC<{value:I_SuggestionsContext,children:ReactNode}> = ({value,children})=>{
    return (
        <SuggestionsContext.Provider value={value}>
            {children}
        </SuggestionsContext.Provider>
    )
}
export const useSuggestionContext = ()=>useContext(SuggestionsContext)