import { ReactNode } from "react"

export type I_user = {
    username:string,
    name:string,
    hub:{text:string,id:number},
    isActive:boolean
}
export type I_bottomMenuItem = {
    text:string,
    value:string,
    icon:ReactNode
}
export type I_consignment_status = 
    'pickup_pending' | 'pickup_success' | 'pickup_unsuccess' |
    'delivary_pending' | 'delivary_success' | 'delivary_unsuccess'
export const consignment_status_dic:{[key in I_consignment_status]:{text:string,bg:string,color:string}} = {
    'pickup_pending':{text:'در انتظار جمع آوری',bg:'#FFE9A1',color:'#333'},
    'pickup_success':{text:'جمع آوری شده',bg:'#FFE9A1',color:'green'},
    'pickup_unsuccess':{text:'جمع آوری نشده',bg:'#FFE9A1',color:'red'},
    'delivary_pending':{text:'در انتظار توزیع',bg:'#EFE7EC',color:'#333'},
    'delivary_success':{text:'توزیع شده',bg:'#EFE7EC',color:'green'},
    'delivary_unsuccess':{text:'توزیع نشده',bg:'#EFE7EC',color:'red'}
}
export type I_consignment = {
    number:string,
    status:I_consignment_status,
    shift:string,
    address:string,
    receiver:string,
    description:string,
    id:number
}
export type I_consignmentPriority = 'pin' | 'driver'
export const consignmentPriorityDic:{[key in I_consignmentPriority]:string} = {
    "pin":'اولویت بندی بر اساس پین',
    "driver":'اولویت بندی بر اساس راننده',
}
export type I_searchActionHook = {set:(action:any)=>void,click:()=>void}
export type I_shift = {
    timeRange:number[],
    amount:number,
    zone:string,
    date:string,
    id:number,
    number:string,
    hub:{
        id:number,
        name:string,
        address:string,
        lat:number,
        lng:number
    }
}
export type I_dateShift = {
    dateArray:number[],
    shifts:I_shift[]
}
export type I_bottomMenuHook = {
    items:I_bottomMenuItem[],
    active:string,
    set:(v:string)=>void,
    isActive:(v:string)=>boolean,
    render:()=>ReactNode
}
