import { AINumber } from "aio-input";
import { FC } from "react";

const StepNumber: FC<{value:number,onChange:(v:number)=>void}> = ({value,onChange}) => {
    const changeByDir = (dir:-1 | 1)=>{
        let newValue = value + dir
        if(newValue < 0){newValue = 0}
        onChange(newValue)
    }
    const changeByInput = (newValue:any)=>{
        onChange(newValue || 0)
    }
    return (
        <div className="flex-row- align-v- brd-c-12- br-12- p-12- w-100- gap-6-">
            <div className="flex-row- align-vh-" onClick={()=>changeByDir(1)}>
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#aaa" />
                    <path d="M12.5 20H27.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 27.5V12.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <AINumber value={value} onChange={(value)=>changeByInput(value)} justify={true} className="h-36- flex-1- br-8- fs-14- bold- brd-c-12-"/>
            <div className="flex-row- align-vh-" onClick={()=>changeByDir(-1)}>
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#aaa" />
                    <path d="M12.5 20H27.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    )
}
export default StepNumber