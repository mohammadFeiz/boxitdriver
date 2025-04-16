import { FC, useState } from "react"
import { I_consignment, I_deliveryModel, I_deliveryModelType } from "../types"
import FooterButtons from "./footer-buttons"
import ImagePlaceholder from "./image-placeholder"
import { useForm } from "aio-input"
import { Signature } from "./signature"
import usePopup from "aio-popup"
import { useAppContext } from "../context"
import base64ToFile from "../utils/base64_to_file"

const DeliveryModal: FC<{ consignments: I_consignment[], multiple: boolean, onFailedDelivery: () => void, onClose: () => void }> = ({ consignments, multiple, onFailedDelivery, onClose }) => {
    const { apis, user } = useAppContext()
    const [sign, setSign] = useState<any>()
    const typeDic: { [key in I_deliveryModelType]: string } = {
        '0': 'نوع اول',
        '1': 'نوع دوم'
    }
    const popup = usePopup()
    const openSignModal = () => {
        popup.addModal({
            position: 'center',
            body: (
                <Signature
                    attrs={{
                        style: { width: 300, height: 300 },
                    }}
                    onSave={(file) => {
                        setSign(file)
                        popup.removeModal()
                    }}
                />
            )
        })
    }
    let signUrl;
    try {
        signUrl = URL.createObjectURL(sign) || '';
    }
    catch { signUrl = '' }
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
                        html: (
                            <div className="w-100-">
                                <div className="ئ-ذ-12-">امضا</div>
                                {
                                    !!sign &&
                                    <img src={signUrl} alt="signature" className="w-168- h-144- br-4- brd-c-13- pointer-"
                                        onClick={() => {
                                            openSignModal()
                                        }}
                                    />
                                }
                                {
                                    !sign &&
                                    <div onClick={() => openSignModal()} className="w-100- h-36- brd-c-13- br-6- flex-row- align-v- p-h-12- pointer-">
                                        برای ثبت امضا اینجا بزنید
                                    </div>
                                }
                            </div>
                        )
                    },
                    {
                        input: { type: 'image', field: 'image', label: 'انتخاب تصویر', placeholder: <ImagePlaceholder />,width:144,imageAttrs:{style:{width:168}} }
                    },
                ]
            }
        }
    })
    const submit = async () => {
        const deliveryCode = form.data.code
        const res = await apis.successDelivery({
            driverId: user.id,
            consignments,
            deliveryCode,
            description: '',
            signature: sign,
            nationalCode: form.data.nationalCode,
            image: base64ToFile(form.data.image)
        })
        if (res) { onClose() }
    }
    const getContent = () => {
        return (
            <>
                <div className="flex-1- ofy-auto- p-12-">
                    {form.renderLayout}
                </div>
                <FooterButtons
                    trueAttrs={{ disabled: form.isSubmitDisabled(), onClick: submit }}
                    canselAttrs={{ onClick: () => onFailedDelivery() }}
                    trueText='تایید' canselText='عدم تحویل'
                />
                {popup.render()}
            </>
        )
    }
    return (<div className="flex-col- gap-12 fs-12- h-100-">{getContent()}</div>)
}
export default DeliveryModal;