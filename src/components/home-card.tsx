import { FC, ReactNode, useEffect, useState } from "react";
import { consignment_status_dic, I_consignment, I_consignment_status } from "../types";
import { useHomeContext } from "../pages/home/context";
import * as svgs from './../assets/svgs';

export const HomeCard: FC<{ consignment: I_consignment,index:number }> = ({ consignment,index }) => {
    const [mounted,setMounted] = useState<boolean>(false)
    useEffect(()=>{
        setTimeout(()=>setMounted(true),index * 120)
    },[])
    const {openDeliveryModal} = useHomeContext()
    const { number, status, shift, address, receiver, description } = consignment;
    const label_layout = (text: string, icon: ReactNode) => {
        return (
            <div className="flex-row- gap-6- fs-12- op-80-">
                <div className="msf">{icon}</div>
                <div className="msf">{text}</div>
            </div>
        )
    }
    const text_layout = (text: string) => {
        return (
            <div className="fs-12- m-b-8-">{text}</div>
        )
    }
    return (
        <div className={`brd-2 p-12- br-16- height-card-${mounted?' mounted-':''}`}>
            <div className="flex-row- fs-12- align-v- gap-6- h-36- brd-c-13- brd-b-">
                <div className="brd-c-8- w-16- h-16- br-4-"></div>
                <div className="bold- flex-1-">{`شماره مرسوله : ${number}`}</div>
                <Status status={status} />
            </div>
            <div className="flex-row- align-v- gap-4- h-48-">
                <div className="flex-1-"></div>
                <div className="bg-4 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.Icon8 />{shift}</div>
                <div className="bg-5 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.Icon9 />احراز هویت</div>
            </div>
            {label_layout('آدرس:', <svgs.Icon5 />)}
            {text_layout(address)}
            <div className="flex-row-">
                <div className="flex-col- flex-1-">
                    {label_layout('نام گیرنده:', <svgs.Icon6 />)}
                    {text_layout(receiver)}
                </div>
                <div className="flex-row- align-vh-"><svgs.Icon11 /></div>
            </div>
            {label_layout('توضیحات:', <svgs.Icon7 />)}
            {text_layout(description)}
            <div className="brd-c-13- brd-b- m-b-12-"></div>
            <div className="flex-row- align-v-">
                <button className='h-36- br-8- bg-2 c-16- p-h-12- brd-none-' onClick={()=>openDeliveryModal(consignment)}>به مقصد رسیدم</button>
                <div className="flex-1-"></div>
                <div className="flex-row- align-vh-"><svgs.Icon10 /></div>
            </div>
        </div>
    )
}
const Status: FC<{ status: I_consignment_status }> = ({ status }) => {
    const {bg,color,text} = consignment_status_dic[status];
    return (<div className="p-h-12- h-24- br-12- flex-row- align-v-" style={{ background: bg,color }}>{text}</div>)
}
