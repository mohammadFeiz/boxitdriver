import { useEffect, useState } from "react"
import { Apis } from "../../apis"
import { I_shift, I_shiftsHook, I_user } from "../../types"
import AIODate from "aio-date"

export const useShifts = (apis:Apis,user:I_user):I_shiftsHook=>{
    const [retry,setretry] = useState<boolean>(false)
    const [shifts,setShifts] = useState<I_shift[]>([])
    const getShifts = async (date?:number[])=>{
        debugger
        date = date || new AIODate().getToday(true)
        const res = await apis.getMyShifts(date)
        if(res){setShifts(res)}
        else {setretry(true)}
    }
    useEffect(()=>{getShifts()},[])
    return {shifts,retry,getShifts}
}