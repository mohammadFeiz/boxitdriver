import { FC, useState } from "react";
import { I_consignment } from "../types";
import { AISelect } from "aio-input";
import * as svgs from './../assets/svgs';
import { GetArray, I_useDrag, ReOrder, useDrag } from "aio-utils";
import FooterButtons from "./footer-buttons";
import { useAppContext } from "../context";

const PriorityModal: FC<{ consignments: I_consignment[],onClose:()=>void }> = (props) => {
    const {apis,successMessage} = useAppContext()
    const [consignments, setConsignments] = useState<I_consignment[]>(props.consignments)
    const reOrder = (index: number, newIndex: number) => {
        const newConsignments: I_consignment[] = ReOrder(consignments, index, newIndex)
        setConsignments(newConsignments)
    }
    const drag = useDrag((dragData, dropData) => reOrder(dragData.index, dropData.index))
    const submit = async ()=>{
        const res = await apis.sendNewPriority(consignments)
        if(res){
            successMessage('اولویت بندی با موفقیت انجام شد')
            props.onClose()
        }
    }
    const options = GetArray(consignments.length)
    return (
        <div className="flex-col- p-12- h-100-">
            <div className="flex-col- flex-1- ofy-auto- gap-12-">
                {
                    consignments.map((o, i) => {
                        return <Card key={i} consignment={o} index={i} reOrder={reOrder} options={options} drag={drag} />
                    })
                }
            </div>
            <FooterButtons
                trueText="تایید"
                canselText="انصراف"
                trueAttrs={{
                    onClick:()=>submit()
                }}
                canselAttrs={{
                    onClick:props.onClose
                }}
            />
        </div>
    )
}
export default PriorityModal
const Card: FC<{ consignment: I_consignment, index: number, options: number[], reOrder: (index: number, newIndex: number) => void, drag: I_useDrag }> = ({ consignment, index, options, reOrder, drag }) => {
    return (
        <div className="p-12- bg-d-10- br-12- fs-12- flex-col- gap-12-" {...drag.getDragAttrs({index})} {...drag.getDropAttrs({index})}>
            <div className="flex-row- align-v- gap-6-">
                <svgs.reOrder />
                <AISelect
                    value={index} popover={{fitHorizontal:true}}
                    options={options} className='bg-none- brd-c-10- flex-1-'
                    option={{
                        text: (index) => `اولویت ${index + 1}`,
                        value: (index) => index,
                        onClick: (newIndex) => reOrder(index, newIndex)
                    }}
                />
            </div>
            <div className="p-r-6- m-r-12-" style={{ borderRight: '2px solid #FFC813' }}>
                <div className="flex-row- align-v- op-70-">
                    <div className="msf">آدرس مشتری:</div>
                    <div className="flex-1-"></div>
                    <div className="msf">{`شماره مرسوله : ${consignment.number}`}</div>
                </div>
                <div className="msf">{consignment.address}</div>
            </div>
        </div>
    )
}
//xlsm