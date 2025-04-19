import { FC } from "react"
import { I_consignment } from "../types"
import { AICheckbox } from "aio-input"

const ScanRow:FC<{consignment:I_consignment,value:boolean,index:number,onChange:(v:boolean)=>void}> = ({consignment,onChange,value,index})=>{
    return (
        <div className="flex-row- brd-c-12- br-6- h-36- align-v-">
            <div className="w-24- flex-row- align-vh-">{index + 1}</div>
            <AICheckbox
                className="brd-none-"
                value={value}
                onChange={(v)=>onChange(v)}
                text={<div className="bold-">{`${consignment.number}(${consignment.receiver})`}</div>}
            />
        </div>
    )
}
export default ScanRow