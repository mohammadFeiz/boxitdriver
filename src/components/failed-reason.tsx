import { FC, useEffect, useState } from "react"
import { useHomeContext } from "../pages/home/context"
import FooterButtons from "./footer-buttons"
import ImagePlaceholder from "./image-placeholder"
import { I_consignment, I_failedDeliveryModel, I_failedReason } from "../types"
import { useForm } from "aio-input"

const FailedReason: FC<{ consignments: I_consignment[], multiple: boolean, onSubmit: (v: I_failedDeliveryModel) => void, onCansel: () => void }> = ({ consignments, multiple, onSubmit, onCansel }) => {
    const { popup } = useHomeContext()
    const [options, setOptions] = useState<I_failedReason[]>([])
    const fetchOptions = () => {
        const options: I_failedReason[] = [
            { text: 'عدم حضور مشتری', id: 0 },
            { text: 'خرابی خودرو/موتور - تصادف کردم', id: 1 },
            { text: 'مشکل دستگاه پوز', id: 2 },
            { text: 'موقعیت مکانی اشتباه است- آدرس پیدا نکردم', id: 3 },
            { text: 'دلایل دیگر', id: 4 }
        ]
        setOptions(options)
    }
    useEffect(() => {
        fetchOptions()
    }, [])
    const form = useForm<I_failedDeliveryModel>({
        initData: {},
        isRequired: (data, field) => {
            if(data){}
            if (field === 'reason') { return true }
            return false
        },
        getLayout: () => {
            return {
                v: [
                    {
                        input: {
                            label: `دلیل عدم تحویل مرسوله ${multiple ? 'ها' : consignments[0].number} را ذکر کنید`,
                            type: 'radio',
                            options,
                            field: 'reason',
                            option: {
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
                trueAttrs={{ disabled: form.isSubmitDisabled(), onClick: () => { onSubmit(form.data); popup.removeModal() } }}
                trueText="ثبت" canselAttrs={{ onClick: () => onCansel() }}
            />
        </div>
    )
}
export default FailedReason