import { useEffect, useState } from "react"
import { Apis } from "../../apis"
import { I_shift, I_shiftsHook } from "../../types"
import AIODate from "aio-date"

export const useShifts = (apis:Apis):I_shiftsHook=>{
    const [retry,setretry] = useState<boolean>(false)
    const [shifts,setShifts] = useState<I_shift[]>([])
    const getShifts = async (date?:number[])=>{
        date = date || new AIODate().getToday(true)
        const res = await apis.getShifts(date)
        if(res){setShifts(res)}
        else {setretry(true)}
    }
    useEffect(()=>{getShifts()},[])
    return {shifts,retry,getShifts}
}