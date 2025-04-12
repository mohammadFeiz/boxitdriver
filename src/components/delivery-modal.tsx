import { FC } from "react"
import { I_consignment, I_deliveryModel, I_deliveryModelType } from "../types"
import FooterButtons from "./footer-buttons"
import ImagePlaceholder from "./image-placeholder"
import { useForm } from "aio-input"

const DeliveryModal: FC<{ consignments: I_consignment[], multiple: boolean,onFailedDelivery:()=>void }> = ({ consignments, multiple,onFailedDelivery }) => {
    const typeDic: { [key in I_deliveryModelType]: string } = {
        '0': 'نوع اول',
        '1': 'نوع دوم'
    }
    const form = useForm<I_deliveryModel>({
        fa: true,
        initData: {
            hasCode: true
        },
        debug: true,
        isRequired: (data, field) => {
            if (data.hasCode) {
                if (field === 'code') { return true }
            }
            else {
                if (field === 'type') { return true }
                if (field === 'nationalCode') { return true }
            }
            return false
        },
        getLayout: (obj) => {
            return {
                className: 'gap-12-',
                v: [
                    {
                        className: 'm-b-12-',
                        h: [
                            { html: 'شماره مرسوله : ' },
                            { html: multiple ? consignments.map((o) => o.number).join(' - ') : consignments[0].number }
                        ]
                    },
                    {
                        input: {
                            label: '',
                            field: 'hasCode',
                            type: 'buttons',
                            attrs: { className: 'buttons-1' },
                            options: [{ text: 'کد تحویل دارد', value: true }, { text: 'کد تحویل ندارد', value: false }],
                            option: {
                                className: () => 'flex-1-',
                                justify: () => true
                            }
                        }
                    },
                    {
                        show: !!obj.getData().hasCode,
                        input: { type: 'text', field: 'code', label: 'کد تحویل', requiured: !!obj.getData().hasCode }
                    },
                    {
                        show: !obj.getData().hasCode,
                        input: {
                            type: 'select', field: 'type', label: 'نوع',
                            options: Object.keys(typeDic),
                            popover: { fitHorizontal: true },
                            option: {
                                text: (option: I_deliveryModelType) => typeDic[option],
                                value: (option) => option
                            }
                        }
                    },
                    {
                        show: !obj.getData().hasCode,
                        input: {
                            type: 'text', field: 'nationalCode', label: 'کد ملی',
                            validateType: "irNationalCode"
                        }
                    },
                    {
                        input: { type: 'text', field: 'sign', label: 'امضای گیرنده' }//notice
                    },
                    {
                        input: { type: 'image', field: 'image', label: 'انتخاب تصویر', placeholder: <ImagePlaceholder /> }
                    },
                ]
            }
        }
    })
    const getContent = () => {
        return (
            <>
                <div className="flex-1- ofy-auto- p-12-">
                    {form.renderLayout}
                </div>
                <FooterButtons
                    trueAttrs={{ disabled: form.isSubmitDisabled() }}
                    canselAttrs={{ onClick: () => onFailedDelivery() }}
                    trueText='تایید' canselText='عدم تحویل'
                />
            </>
        )
    }
    return (<div className="flex-col- gap-12 fs-12- h-100-">{getContent()}</div>)
}
export default DeliveryModal;