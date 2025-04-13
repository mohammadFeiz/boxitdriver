import { FC, ReactNode, useEffect, useState } from "react";
import { I_consignment } from "../../types";
import { useHomeContext } from "./context";
import * as svgs from '../../assets/svgs';
import { AICheckbox } from "aio-input";
import { Splitter } from "../../components/splitter";

export const HomeCard: FC<{ consignment: I_consignment, index: number }> = ({ consignment, index }) => {
    const [mounted, setMounted] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() => setMounted(true), index * 120)
    }, [])
    return (
        <div className={`brd-2 p-12- br-16- height-card-${mounted ? ' mounted-' : ''}`}>
            <CardHeader consignment={consignment} />
            <CardTags consignment={consignment} />
            <CardBody consignment={consignment} />
            <CardFooter consignment={consignment} />
        </div>
    )
}
const Status: FC<{consignment:I_consignment}> = ({ consignment }) => {
    const getColor = ()=>{
        if(consignment.type === 'pickup'){return '#FFE9A1'}
        else if(consignment.type === 'delivery'){return '#EFE7EC'}
        return '#000000'
    }
    return (<div className="p-h-12- h-24- br-12- flex-row- align-v-" style={{ color: '#333', background:getColor() }}>{consignment.status.text}</div>)
}

const CardHeader: FC<{ consignment: I_consignment }> = ({ consignment }) => {
    const { consignmentHook } = useHomeContext()
    const { isConsignmentSelected, selectConsignment } = consignmentHook;
    const selected = isConsignmentSelected(consignment.id)
    return (
        <>
            <div className="flex-row- fs-12- align-v- gap-6- h-36- p-b-6-">
                <AICheckbox value={selected} onChange={() => selectConsignment(consignment)} />
                <div className="bold- flex-1-">{`شماره مرسوله : ${consignment.number}`}</div>
                <Status consignment={consignment} />
            </div>
            <Splitter/>
        </>
    )
}
const CardTags: FC<{ consignment: I_consignment }> = ({ consignment }) => {
    return (
        <div className="flex-row- align-v- gap-4- h-48-">
            <div className="flex-1-"></div>
            {consignment.tag_hazineYeKala && <div className="bg-9 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.hazineKala />هزینه کالا</div>}
            {consignment.isCod && <div className="bg-10 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.pasKeraye />پس کرایه</div>}
            <div className="bg-4 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.Icon8 />{consignment.shift}</div>
            {consignment.tag_ehrazeHoviat && <div className="bg-5 br-12- p-h-8- fs-12- h-24- flex-row- align-vh- gap-4-"><svgs.Icon9 />احراز هویت</div>}
        </div>
    )
}
const CardBody: FC<{ consignment: I_consignment }> = ({ consignment }) => {
    const field_layout = (icon: ReactNode, label: string, text: string) => {
        return (
            <div className="flex-row- gap-6-">
                <div className="flex-row- gap-6- fs-12- op-80-">
                    <div className="msf">{icon}</div>
                    <div className="msf">{label}</div>
                </div>
                <div className="fs-12- m-b-8-">{text}</div>
            </div>
        )
    }
    return (
        <>
            {field_layout(<svgs.Icon5 />, 'آدرس:', consignment.address)}
            <div className="flex-row- align-v-">
                <div className="flex-col- flex-1-">
                    {field_layout(<svgs.Icon6 />, 'نام گیرنده:', consignment.receiver)}
                </div>
                <div className="flex-row- align-vh-"><svgs.Icon11 /></div>
            </div>
            {field_layout(<svgs.Icon7 />, 'توضیحات:', consignment.description)}
        </>
    )
}
const CardFooter: FC<{ consignment: I_consignment }> = ({ consignment }) => {
    const { arriveToDestinationButton } = useHomeContext()
    const { consignmentHook,navigationButtonClick } = useHomeContext()
    const {selectedConsignments} = consignmentHook;
    if (selectedConsignments.length) { return null }
    return (
        <>
            <Splitter />
            <div className="flex-row- align-v- p-t-6-">
                <button className='h-36- br-8- bg-2 c-16- p-h-12- brd-none-' onClick={() => arriveToDestinationButton([consignment],false)}>به مقصد رسیدم</button>
                <div className="flex-1-"></div>
                <button className="flex-row- align-vh- brd-none- w-36- h-36- br-8- p-0-" onClick={()=>navigationButtonClick([consignment],false)}><svgs.Icon10 /></button>
            </div>
        </>
    )
}
