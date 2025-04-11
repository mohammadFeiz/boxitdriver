import { useEffect, useState } from "react"
import { I_consignment, I_consignmentHook, I_timelineHook } from "../../types"
import { Apis } from "../../apis"
import AIODate from "aio-date"

const useConsignment = (apis:Apis): I_consignmentHook => {
    const [consignments, setConsignments] = useState<I_consignment[]>([])
    const [reTry,setReTry] = useState<boolean>(false)
    const [selectedConsignments, setSelectedConsignments] = useState<I_consignment[]>([])
    const isConsignmentSelected = (id: number): boolean => !!selectedConsignments.find((o) => typeof o.id === 'number' && o.id === id)
    const selectConsignment = (consignment: I_consignment) => {
        const selected = isConsignmentSelected(consignment.id)
        let newSelectedConsignments: I_consignment[] = []
        if (selected) { newSelectedConsignments = selectedConsignments.filter((o) => o.id !== consignment.id) }
        else { newSelectedConsignments = [...selectedConsignments, consignment] }
        setSelectedConsignments(newSelectedConsignments)
    }
    const isAllSelected = ():boolean=>!consignments.find((o)=>!isConsignmentSelected(o.id))
    const isThereSelected = ()=>!!selectedConsignments.find((o)=>isConsignmentSelected(o.id))
    const selectAll = ()=>{
        if(isAllSelected()){setSelectedConsignments([])}
        else {setSelectedConsignments([...consignments])}
    }
    const getConsignments = async (date?:number[]) => {
        date = date || new AIODate().getToday(true);
        const res = await apis.getConsignments(date)
        if(res === false){setReTry(true);}
        else {
            setReTry(false)
            setConsignments(res)
        }
    }
    const changeConsignments = (newConsignments:I_consignment[])=>{
        setConsignments(newConsignments)
    }
    useEffect(()=>{
        getConsignments()
    },[])
    
    return {
        consignments,
        getConsignments,
        selectedConsignments,
        isConsignmentSelected,
        selectConsignment,
        changeConsignments,
        selectAll,
        isAllSelected,
        isThereSelected,
        reTry
    }
}
export default useConsignment