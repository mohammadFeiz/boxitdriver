import { SplitNumber } from "aio-utils";
import { FC, useEffect, useState } from "react";
import { Splitter } from "./splitter";
import FooterButtons from "./footer-buttons";
import { I_consignment } from "../types";
import { useAppContext } from "../context";

const CodePaymentModal: FC<{cods:I_consignment[],onPaymentSuccess:()=>void,onFailedDelivery:()=>void}> = ({cods,onPaymentSuccess,onFailedDelivery}) => {
    const {apis} = useAppContext()
    const [amounts, setAmounts] = useState<{ product: number, send: number, total: number }>({ product: 0, send: 0, total: 0 })
    const getAmounts = async ()=>{
        const amounts = await apis.getCODsAmounts(cods)
        setAmounts(amounts)
    }
    useEffect(() => {
        getAmounts()
    }, [])
    const payment = async ()=>{
        const res = await apis.codsPayment(cods)
        if(res){onPaymentSuccess()}
    }
    const failed = ()=>{
        onFailedDelivery()
    }
    const unit = 'تومان'
    const row_layout = (text: string, amount: number) => {
        return (
            <div className="flex-row- align-v- fs-12- gap-4-">
                <div className="">{text}</div>
                <div className="">{`(${unit})`}</div>
                <div className="">:</div>
                <div className="flex-1-"></div>
                <div className="bold-">{SplitNumber(amount)}</div>
            </div>
        )
    }
    return (
        <div className="flex-col- h-fit-">
            <div className="flex-col- border-panel m-12- gap-24-">
                {row_layout('هزینه کالا', amounts.product)}
                {row_layout('هزینه ارسال', amounts.send)}
                <Splitter dashed={true} />
                {row_layout('مجموع مبلغ قابل پرداخت', amounts.total)}
            </div>
            <FooterButtons
                trueText="پرداخت"
                canselText="عدم تحویل"
                trueAttrs={{
                    onClick:payment
                }}
                canselAttrs={{
                    onClick:failed
                }}
            />
        </div>
    )
}
export default CodePaymentModal