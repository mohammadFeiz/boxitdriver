import { FC, useState } from "react";

const StepNumber: FC<{value:number,onChange:(v:number)=>void}> = ({value,onChange}) => {
    const changeByDir = (dir:-1 | 1)=>{
        let newValue = value + dir
        if(newValue < 0){newValue = 0}
        onChange(newValue)
    }
    return (
        <div className="msf">
            <div className="msf" onClick={()=>changeByDir(1)}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#CCCCCC" />
                    <path d="M12.5 20H27.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 27.5V12.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="msf">{value}</div>
            <div className="msf" onClick={()=>changeByDir(-1)}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#CCCCCC" />
                    <path d="M12.5 20H27.5" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    )
}
export default StepNumber