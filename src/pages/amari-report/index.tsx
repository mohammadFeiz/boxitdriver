import { AIDate, AIFormInput } from "aio-input";
import { FC, useRef, useState } from "react";
import { I_amari_report, I_dateRange } from "../../types";
import { useAppContext } from "../../context";
import useDateRange from "../../components/use-date-range";

const AmariReport: FC = () => {
    const { apis } = useAppContext()
    const [data, setData] = useState<I_amari_report>({
        delivery: {
            total: 0,
            pending: 0,
            success: 0,
            failed: 0
        },
        pickup: {
            total: 0,
            pending: 0,
            success: 0,
            failed: 0
        },
        bag: {
            total: 0,
            pending: 0,
            success: 0,
            failed: 0
        }
    })
    const fetchData = async (dateRange:I_dateRange)=>{
        const res = await apis.amariReport(dateRange)
        if (res) {
            setData(res)
            return true
        }
        else {
            return false
        }
    }
    const dateRangeHook = useDateRange((async (newDateRange)=>await fetchData(newDateRange)))
    const toolbar_layout = () => dateRangeHook.render()
    const row_layout = (label: string, value: number) => {
        return (
            <div className="flex-row- align-v-">
                <div className="fs-12- op-80-">{label}</div>
                <div className="flex-1-"></div>
                <div className="fs-16- bold-">{value}</div>
            </div>
        )
    }
    const card_layout = (type: 'delivery' | 'pickup' | 'bag') => {
        const totalDic = {
            delivery: 'جمع تعداد کل مرسولات توزیعی',
            pickup: 'تعداد کل مرسولات جمع آوری',
            bag: 'تعداد کل کیسه‌ها'
        }
        const pendingDic = {
            delivery: 'تعداد مرسولات  در انتظار توزیع',
            pickup: 'تعداد مرسولات در انتظار جمع آوری',
            bag: 'تعداد کیسه‌های در انتظار تحویل'
        }
        const successDic = {
            delivery: 'تعداد مرسولات توزیع شده',
            pickup: 'تعداد مرسولات جمع آوری شده',
            bag: 'تعداد کیسه های تحویل شده'
        }
        const failedDic = {
            delivery: 'تعداد مرسولات توزیع ناموفق',
            pickup: 'تعداد مرسولات  جمع آوری ناموفق',
            bag: 'تعداد کیسه‌های تحویل ناموفق'
        }
        return (
            <div className="flex-col- gap-6- brd-c-12- br-6- p-12- bg-d-5-">
                {row_layout(totalDic[type], data[type].total)}
                {row_layout(pendingDic[type], data[type].pending)}
                {row_layout(successDic[type], data[type].success)}
                {row_layout(failedDic[type], data[type].failed)}
            </div>
        )
    }
    const cards_layout = () => {
        return (
            <div className="flex-col- gap-12-">
                {card_layout('delivery')}
                {card_layout('pickup')}
                {card_layout('bag')}
            </div>
        )
    }
    return (
        <div className="flex-col-">
            {toolbar_layout()}
            {cards_layout()}
        </div>
    )
}
export default AmariReport