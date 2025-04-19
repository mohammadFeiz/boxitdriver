import { AIDate, AIFormInput, AISelect } from "aio-input";
import { FC, useEffect, useRef, useState } from "react";
import { I_amari_report, I_consignmentType, I_listi_report_filter } from "../../types";
import { useAppContext } from "../../context";
import ScanInput from "../../components/scan-input";
import useDateRange from "../../components/use-date-range";
type I_row = {}
const ListiReport: FC = () => {
    const [data,setData] = useState<I_row[]>([])
    const { apis } = useAppContext()
    const [filter,setFilter] = useState<I_listi_report_filter>({
        dateRange:{from:undefined,to:undefined},
        type:undefined,
        status:undefined,
        cprNumber:undefined
    })
    const filterRef = useRef<I_listi_report_filter>(filter)
    filterRef.current = filter
    const fetchData = async (filter:I_listi_report_filter)=>{
        const res:I_row[] = await apis.listiReport(filter)
        if (res) {
            setData(res)
            return true
        }
        else {
            return false
        }
    }
    useEffect(()=>{
        fetchData(filter)
    },[])
    const changeFilter = async (newFilter:I_listi_report_filter):Promise<boolean>=>{
        const res = await fetchData(newFilter)
        if(res){
            setFilter(newFilter);
            return true
        }
        else {
            return false
        }
    }
    const dateRangeHook = useDateRange(async (newDateRange)=>await changeFilter({...filterRef.current,dateRange:newDateRange}))
    const toolbar_layout = () => {
        return (
            <div className="flex-col-">
                {dateRangeHook.render()}
                <ScanInput onChange={(cprNumber)=>changeFilter({...filterRef.current,cprNumber})}/>
                <div className="msf">
                    <div className="flex-col-">
                        <div className="msf">نوع</div>
                        <AISelect/>
                    </div>
                    <div className="flex-col-">
                        <div className="msf">وضعیت</div>
                        <AISelect/>
                    </div>
                </div>
            </div>
        )
    }
    const table_layout = ()=>{
        return null
    }
    return (
        <div className="flex-col-">
            {toolbar_layout()}
            {table_layout()}
        </div>
    )
}
export default ListiReport