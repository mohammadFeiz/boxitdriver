import { useEffect, useState } from "react"
import { I_consignment, I_consignmentHook, I_consignmentType } from "../../types"
import { Apis } from "../../apis"
import AIODate from "aio-date"
import { I_usePopup } from "aio-popup"

const useConsignment = (apis:Apis,popup:I_usePopup,setretry:any): I_consignmentHook => {
    const [consignments, setConsignments] = useState<I_consignment[]>([])
    const [selectedConsignments, setSelectedConsignments] = useState<I_consignment[]>([])
    const isConsignmentSelected = (id: number): boolean => !!selectedConsignments.find((o) => typeof o.id === 'number' && o.id === id)
    const selectConsignment = (consignment: I_consignment) => {
        const selected = isConsignmentSelected(consignment.id)
        let newSelectedConsignments: I_consignment[] = []
        if (selected) { newSelectedConsignments = selectedConsignments.filter((o) => o.id !== consignment.id) }
        else { 
            if(!canSelect(consignment.type)){
                const accesptType = {delivery:'توزیع',pickup:'جمع آوری'}[selectedConsignments[0].type]
                popup.addSnackebar({
                    text:'انتخاب این مرسوله امکان پذیر نیست',
                    subtext:`کارت های انتخاب از نوع ${accesptType} هستند پس فقط ${accesptType} ها قابل انتخاب هستند`,
                    type:'warning'
                })
                return
            }
            newSelectedConsignments = [...selectedConsignments, consignment] 
        }
        setSelectedConsignments(newSelectedConsignments)
    }
    const canSelect = (type:I_consignmentType)=>{
        if(!selectedConsignments.length){return true}
        return type === selectedConsignments[0].type
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
        if(res === false){
            setretry({text:'',onClick:()=>getConsignments(date)})
        }
        else {
            setretry(false)
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
    }
}
export default useConsignment