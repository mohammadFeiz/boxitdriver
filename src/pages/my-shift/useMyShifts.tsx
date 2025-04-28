import { useEffect, useState } from "react"
import { Apis } from "../../apis"
import { I_shift, I_shiftsHook, I_user } from "../../types"
import AIODate from "aio-date"

export const useMyShifts = (apis:Apis,user:I_user):I_shiftsHook=>{
    const [retry,setretry] = useState<boolean>(false)
    const [myShifts,setMyShifts] = useState<I_shift[]>([])
    const getMyShifts = async (date?:number[])=>{
        date = date || new AIODate().getToday(true)
        const res = await apis.getMyShifts(date)
        if(res){setMyShifts(res)}
        else {setretry(true)}
    }
    useEffect(()=>{getMyShifts()},[])
    return {myShifts,retry,getMyShifts}
}