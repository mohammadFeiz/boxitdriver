import { FC, ReactNode } from "react";

const Pair:FC<{label:string,value:ReactNode,dir:'v' | 'h'}> = ({label,value,dir})=>{
    if(dir === 'v'){
        return (
            <div className="flex-1- flex-col- gap-6-">
                <div className="c-6-">{label}</div>
                <div className="bold-">{value}</div>
            </div>
        )
    }
    return (
        <div className="flex-1- flex-row- gap-6-">
            <div className="c-6-">{label}</div>
            <div className="bold-">{value}</div>
        </div>
    )
}
export default Pair