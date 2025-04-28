import { FC } from "react"
import { AICheckbox } from "aio-input"

const ScanRow:FC<{number:string,value:boolean,index:number,onChange:(v:boolean)=>void}> = ({number,onChange,value,index})=>{
    return (
        <div className="flex-row- brd-c-12- br-6- h-36- align-v-">
            <div className="w-24- flex-row- align-vh-">{index + 1}</div>
            <AICheckbox
                className="brd-none-"
                value={value}
                onChange={(v)=>onChange(v)}
                text={<div className="bold-">{`${number}`}</div>}
            />
        </div>
    )
}
export default ScanRow