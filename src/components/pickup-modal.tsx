import FooterButtons from "./footer-buttons"
import StepNumber from "./step-number"
import * as svgs from './../assets/svgs';
import { FC, useState } from "react";
import { I_consignment } from "../types";
import usePopup from "aio-popup";
import ScanRow from "./scan-item";
import { useAppContext } from "../context";
import { useHomeContext } from "../pages/home/context";

const PickupModal: FC<{ consignment: I_consignment,onClose:()=>void}> = ({ consignment,onClose }) => {
    const {apis} = useAppContext()
    const {consignmentHook,homeModalHook} = useHomeContext();
    const [count, setCount] = useState<number>(0)
    const popup = usePopup()
    const openScanModal = () => {
        popup.addModal({
            header: { title: 'اسکن مرسولات برای جمع آوری' },
            body: (<Scan count={count} consignment={consignment} />),
            setAttrs: (key) => {
                if (key === 'modal') { return { className: 'bottom-modal bottom-modal-height-fit-content' } }
                if (key === 'backdrop') { return { className: 'dark-backdrop' } }
            }
        })
    }
    const success = async ()=>{
        const res = await apis.pickup_success({pickupId:consignment.number as any,count})
        if(res){
            consignmentHook.getConsignments();
            onClose()
        }
    }
    const failed = ()=>{
        homeModalHook.openFailedModal('pickup', [consignment], false)
    }
    return (
        <>
            <div className="flex-col-">
                <div className="flex-row- align-v- p-12-">
                    <div className="msf">تعداد مرسوله :</div>
                    <div className="msf">{` ${count} مرسوله`}</div>
                    <div className="flex-1-"></div>
                    <button className="button-3 bg-none- brd-none-" onClick={() => openScanModal()}>اسکن مرسولات <svgs.Icon12 /></button>
                </div>
                <div className="flex-row- align-vh- p-12-">
                    <StepNumber value={count} onChange={(v) => setCount(v)} />
                </div>
                <div className="h-24-"></div>
                <FooterButtons
                    trueAttrs={{ disabled: !count,onClick:success }}
                    canselAttrs={{ onClick: () => failed() }}
                    trueText='تایید جمع آوری' canselText='عدم جمع آوری'
                />
            </div>
            {popup.render()}
        </>
    )
}
export default PickupModal
type I_activeItems = { [key: string]: I_consignment | undefined }
const Scan: FC<{ count: number, consignment: I_consignment }> = ({ count, consignment }) => {
    const [activeItems, setActiveItems] = useState<I_activeItems>({})
    const setActiveItem = (consignment: I_consignment) => {
        const isActive = !!activeItems[consignment.id.toString()]
        const newActiveItems: I_activeItems = { ...activeItems, [consignment.id.toString()]: isActive ? undefined : consignment }
        setActiveItems(newActiveItems)
    }
    return (
        <div className="flex-col-">
            <div className="flex-row- align-v- gap-6-">
                <div className="fs-10-">تعداد مرسوله : </div>
                <div className="fs-12- bold-">{`${count} مرسوله`}</div>
            </div>
            <div className="msf">

            </div>
            <div className="msf">
                <div className="flex-col- gap-12-">
                    {/* {consignments.map((consignment, i) => <ScanRow key={i} consignment={consignment} index={i} value={!!activeItems[consignment.id.toString()]} onChange={() => setActiveItem(consignment)} />)} */}
                </div>
            </div>
        </div>
    )
}