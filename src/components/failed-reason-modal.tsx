import { FC, useEffect, useState } from "react"
import { useHomeContext } from "../pages/home/context"
import FooterButtons from "./footer-buttons"
import ImagePlaceholder from "./image-placeholder"
import { I_consignment, I_failedDeliveryModel, I_failedReason } from "../types"
import { useForm } from "aio-input"
import { useAppContext } from "../context"
import base64ToFile from "../utils/base64_to_file"

const FailedReasonModal: FC<{ consignments: I_consignment[], multiple: boolean, onClose: () => void,type:'delivery' | 'pickup' }> = ({ type,consignments, multiple,onClose }) => {
    const { popup } = useHomeContext()
    const {apis} = useAppContext() 
    const [options, setOptions] = useState<I_failedReason[]>([])
    const fetchOptions = async () => {
        if(type === 'delivery'){
            const res = await apis.delivery_getFailedReasons()
            if(res){setOptions(res)}
        }
        else if(type === 'pickup'){
            const res = await apis.pickup_getFailedReasons()
            if(res){setOptions(res)}
        }
        
    }
    useEffect(() => {fetchOptions()}, [])
    const onFailed = async (p: { type: 'delivery' | 'pickup', consignments: I_consignment[], failedReasonId: number, image: any }): Promise<boolean> => {
        const {failedReasonId,image} = p;
        const description = '';
        let res;
        if (type === 'delivery') {res = await apis.delivery_failed({consignments,failedReasonId,description})}
        else {
            const consignment = consignments[0];
            res = await apis.pickup_failed({consignment,failedReasonId,description,image})
        }
        return !!res
    }
    const form = useForm<I_failedDeliveryModel>({
        initData: {},
        isRequired: (data, field) => {
            if(data){}
            if (field === 'failedReasonId') { return true }
            return false
        },
        getLayout: () => {
            return {
                v: [
                    {
                        input: {
                            label: `دلیل عدم ${type === 'delivery'?'تحویل':'جمع آوری'} مرسوله ${multiple ? 'ها' : consignments[0].number} را ذکر کنید`,
                            type: 'radio',
                            options,
                            field: 'failedReasonId',
                            option: {
                                text:(o)=>o.text,
                                value:(o)=>o.id,
                                className: () => 'w-100- bold- fs-11-'
                            }
                        }
                    },
                    {
                        className: 'w-100-',
                        input: {
                            type: 'image',
                            label: `لطفا تصویر موردنظر خود را اضافه کنید:`,
                            attrs: { className: 'brd-c-11- w-100- h-240- br-12-' },
                            deSelect: true,
                            placeholder: <ImagePlaceholder />,
                            field: 'image'
                        }
                    }
                ]
            }
        }
    })
    return (
        <div className="flex-col- h-100- p-12-">
            <div className="flex-1- ofy-auto-">{form.renderLayout}</div>
            <FooterButtons
                trueAttrs={{ 
                    disabled: form.isSubmitDisabled(), 
                    onClick: () => { 
                        debugger
                        const image = form.data.image?base64ToFile(form.data.image):undefined
                        const failedReasonId = form.data.failedReasonId;
                        onFailed({type,consignments,failedReasonId,image}); 
                        popup.removeModal() 
                    } 
                }}
                trueText="ثبت" 
                canselAttrs={{ onClick: onClose }}
            />
        </div>
    )
}
export default FailedReasonModal