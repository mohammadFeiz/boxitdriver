import FooterButtons from "./footer-buttons"
import StepNumber from "./step-number"
import * as svgs from './../assets/svgs';
import { FC, useState } from "react";
import { I_consignment } from "../types";
import usePopup from "aio-popup";
import ScanRow from "./scan-item";

const PickupModal: FC<{ consignments: I_consignment[], multiple: boolean }> = ({ consignments, multiple }) => {
    const [count, setCount] = useState<number>(0)
    const popup = usePopup()
    const openScanModal = () => {
        popup.addModal({
            header: { title: 'اسکن مرسولات برای جمع آوری' },
            body: (<Scan count={count} consignments={consignments} />),
            setAttrs: (key) => {
                if (key === 'modal') { return { className: 'bottom-modal' } }
                if (key === 'backdrop') { return { className: 'dark-backdrop' } }
            }
        })
    }
    return (
        <>
            <div className="flex-col-">
                <div className="flex-row- align-v-">
                    <div className="msf">تعداد مرسوله :</div>
                    <div className="msf">{` ${count} مرسوله`}</div>
                    <div className="flex-1-"></div>
                    <button className="button-3" onClick={()=>openScanModal()}>اسکن مرسولات <svgs.Icon12 /></button>
                </div>
                <StepNumber value={count} onChange={(v) => setCount(v)} />
                <FooterButtons
                    trueAttrs={{ disabled: !count }}
                    canselAttrs={{ onClick: () => { } }}
                    trueText='تایید جمع آوری' canselText='عدم جمع آوری'
                />
            </div>
            {popup.render()}
        </>
    )
}
export default PickupModal
type I_activeItems = { [key: string]: I_consignment | undefined }
const Scan: FC<{ count: number, consignments: I_consignment[] }> = ({ count, consignments }) => {
    const [activeItems, setActiveItems] = useState<I_activeItems>({})
    const setActiveItem = (consignment:I_consignment)=>{
            const isActive = !!activeItems[consignment.id.toString()]
            const newActiveItems:I_activeItems = {...activeItems,[consignment.id.toString()]:isActive?undefined:consignment}
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
                    {consignments.map((consignment, i) => <ScanRow key={i} consignment={consignment} index={i} value={!!activeItems[consignment.id.toString()]} onChange={() => setActiveItem(consignment)} />)}
                </div>
            </div>
        </div>
    )
}