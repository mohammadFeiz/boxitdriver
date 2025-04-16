import { ReactNode } from "react"

export type I_user = {
    username: string,
    name: string,
    hub: { text: string, id: number },
    isActive: boolean,
    id: number
}
export type I_bottomMenuItem = {
    text: string,
    value: string,
    icon: ReactNode
}
export type I_consignment_status = { id: number, text: string }
export type I_consignmentType = 'pickup' | 'delivery'
export type I_consignment = {
    number: string,
    status: I_consignment_status,
    type: I_consignmentType
    shift: string,
    address: string,
    receiver: string,
    description: string,
    id: number,
    isCod?: boolean, //agar pas keraye bood bad entekhabe jami kart ha agar hatta yek pas keraye bood bayad aval safheye pardakhte figma baz beshe bad oon safhe badi
    tag_hazineYeKala?: boolean,
    tag_ehrazeHoviat?: boolean,
    lat: number,
    lng: number
}
export type I_priorityType = 'pin' | 'driver'
export const consignmentPriorityDic: { [key in I_priorityType]: string } = {
    "pin": 'اولویت بندی بر اساس پین',
    "driver": 'اولویت بندی بر اساس راننده',
}
export type I_consignmentHook = {
    consignments: I_consignment[],
    getConsignments: (date?: number[]) => void,
    selectedConsignments: I_consignment[],
    isConsignmentSelected: (id: number) => boolean,
    selectConsignment: (consignment: I_consignment) => void,
    changeConsignments: (newConsignments: I_consignment[]) => void,
    selectAll: () => void,
    isAllSelected: () => boolean,
    isThereSelected: () => boolean,
}
export type I_timelineHook = { getDate: () => number[], render: () => ReactNode }
export type I_searchActionHook = { set: (action: any) => void, click: () => void }
export type I_shift = {
    timeRange: number[],
    amount: number,
    zone: string,
    date: string,
    id: number,
    number: string,
    hub: {
        id: number,
        name: string,
        address: string,
        lat: number,
        lng: number
    }
}
export type I_dateShift = {
    dateArray: number[],
    shifts: I_shift[]
}
export type I_bottomMenuHook = {
    items: I_bottomMenuItem[],
    active: string,
    set: (v: string) => void,
    isActive: (v: string) => boolean,
    render: () => ReactNode
}
export type I_sidemenuHook = {
    close: () => void,
    open: () => void
}
export type I_shiftsHook = {
    shifts: I_shift[],
    retry: boolean,
    getShifts: (date?: number[]) => Promise<void>
}
export type I_failedDeliveryModel = {
    image: string,
    reason: number
}
export type I_failedReason = { text: string, id: number }
export type I_deliveryModelType = '0' | '1'
export type I_deliveryModel = {
    hasCode: boolean,
    code?: string,
    image?: string,
    type?: I_deliveryModelType,//notice
    nationalCode?: string
}
export type I_consignmentLocationTime = { consignment: I_consignment, time: number }
export type I_consignmentLocationTimes = { [consignmentId: string]: I_consignmentLocationTime }
export type I_paymentDetail = { product: number, send: number, total: number }
//dokme ye masir yabi rooye kart ha agar dar halate taki zade shod bayad neshan baz kone va mogheiat ro neshon bede . ama agar chand kart tik khorde bood bayad yek safhe baz beshe ke hame ye in makan har ro be soorate kart neshoon bede va bayad api az parsi map call beshe ke bege be har koodoom az in noghat key mirese va agar rooye kart click kard bayad neshan baz beshe
//agar pardakht na movafagh bood nabayad bere safhe ye bad bar garde rooye oon safhe ke dota dokme ye pardakht va adame tahvil dare . mittone adame tahvil bezane valie bekhad bere safhe ye bad bayad hatman pardakht movafaghiat amiza bahse 