import { AISelect, AIText } from "aio-input";
import { FC, useEffect, useRef, useState } from "react";
import { I_list_report_row, I_listi_report_filter } from "../../types";
import { useAppContext } from "../../context";
import useDateRange from "../../components/use-date-range";
import AIOTable from 'aio-table';
const ListiReport: FC = () => {
    const [rows, setRows] = useState<I_list_report_row[]>([])
    const { apis } = useAppContext()
    const [checkDic, setCheckDic] = useState<{ [key: string]: boolean }>({} as any)
    const checkDicRef = useRef<any>(checkDic)
    checkDicRef.current = checkDic
    const [filter, setFilter] = useState<I_listi_report_filter>({
        dateRange: { from: undefined, to: undefined },
        type: undefined,
        status: undefined,
        cprNumber: undefined
    })
    const filterRef = useRef<I_listi_report_filter>(filter)
    filterRef.current = filter
    const fetchData = async (filter: I_listi_report_filter) => {
        const res = await apis.listiReport(filter)
        if (res) {
            setRows(res)
            return true
        }
        else {
            return false
        }
    }
    useEffect(() => {
        fetchData(filter)
    }, [])
    const changeFilter = async (newFilter: I_listi_report_filter): Promise<boolean> => {
        const res = await fetchData(newFilter)
        if (res) {
            setFilter(newFilter);
            return true
        }
        else {
            return false
        }
    }
    const dateRangeHook = useDateRange(async (newDateRange) => await changeFilter({ ...filterRef.current, dateRange: newDateRange }))
    const toolbar_layout = () => {
        return (
            <div className="flex-col- p-12- gap-12-">
                {dateRangeHook.render()}
                <div className="fs-12-">بارکد</div>
                <AIText
                    value={filter.cprNumber} placeholder="شماره بارکد را وارد کنید"
                    onChange={(cprNumber) => changeFilter({ ...filterRef.current, cprNumber })}
                />
                <div className="flex-row- gap-12- align-v-">
                    <div className="flex-col- flex-1-">
                        <div className="fs-12-">نوع</div>
                        <AISelect />
                    </div>
                    <div className="flex-col- flex-1-">
                        <div className="fs-12-">وضعیت</div>
                        <AISelect />
                    </div>
                </div>
            </div>
        )
    }
    const checkClick = (row:I_list_report_row)=>{
        const id = row.id.toString()
        const checkDic = checkDicRef.current
        const newCheckDic = {...checkDic,[id]:!checkDic[id]}
        setCheckDic(newCheckDic)        
        
    }
    const table_layout = () => {
        return (
            <div className="flex-1-">
                <AIOTable
                    value={rows}
                    columns={[
                        { title: <UncheckIcon />, width: 48, template: ({ row }) => <Check checked={checkDicRef.current[row.id.toString()]} onClick={()=>checkClick(row)} />, justify: true },
                        { title: 'تاریخ', value: 'row.date', justify: true },
                        { title: 'شیفت', value: 'row.shift', minWidth: 72, justify: true },
                        { title: 'وضعیت ', minWidth: 84, value: 'row.status', template: ({ row }) => <Status status={row.status} type={row.type} />, justify: true },
                        { title: 'عملیات', minWidth: 54, justify: true, template: ({ row }) => <Info row={row} /> },
                    ]}
                    rowOption={{
                        attrs: ({ row }) => ({ style: { height: 48 } })
                    }}
                />
            </div>
        )
    }
    return (
        <div className="flex-col-">
            {toolbar_layout()}
            {table_layout()}
        </div>
    )
}
export default ListiReport



const Status: FC<{ status: I_list_report_row['status'], type: I_list_report_row["type"] }> = ({ status, type }) => {
    const dic: { [key in I_list_report_row['status']]: { color: string, background: string } } = {
        "موفق": { color: '#068F6D', background: '#E6FDF1' },
        "در انتظار": { color: '#EA6601', background: '#FDF3EB' },
        "ناموفق": { color: '#FF0000', background: '#FFF2F2' },
    }
    const { color, background } = dic[status]
    return (
        <div className="fs-10- br-16- w-fit- flex-row- align-vh- p-h-12-" style={{ background, color, height: 30 }}>{`${type} ${status}`}</div>
    )
}

const Info: FC<{ row: I_list_report_row }> = ({ row }) => {
    return (
        <div className="w-36- h-36- flex-row- align-vh-">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.25 14.75H10.75V9H9.25V14.75ZM10 7.2885C10.2288 7.2885 10.4207 7.21108 10.5755 7.05625C10.7303 6.90142 10.8077 6.70958 10.8077 6.48075C10.8077 6.25192 10.7303 6.06008 10.5755 5.90525C10.4207 5.75058 10.2288 5.67325 10 5.67325C9.77117 5.67325 9.57933 5.75058 9.4245 5.90525C9.26967 6.06008 9.19225 6.25192 9.19225 6.48075C9.19225 6.70958 9.26967 6.90142 9.4245 7.05625C9.57933 7.21108 9.77117 7.2885 10 7.2885ZM10.0017 19.5C8.68775 19.5 7.45267 19.2507 6.2965 18.752C5.14033 18.2533 4.13467 17.5766 3.2795 16.7218C2.42433 15.8669 1.74725 14.8617 1.24825 13.706C0.749417 12.5503 0.5 11.3156 0.5 10.0017C0.5 8.68775 0.749333 7.45267 1.248 6.2965C1.74667 5.14033 2.42342 4.13467 3.27825 3.2795C4.13308 2.42433 5.13833 1.74725 6.294 1.24825C7.44967 0.749417 8.68442 0.5 9.99825 0.5C11.3123 0.5 12.5473 0.749333 13.7035 1.248C14.8597 1.74667 15.8653 2.42342 16.7205 3.27825C17.5757 4.13308 18.2528 5.13833 18.7518 6.294C19.2506 7.44967 19.5 8.68442 19.5 9.99825C19.5 11.3123 19.2507 12.5473 18.752 13.7035C18.2533 14.8597 17.5766 15.8653 16.7218 16.7205C15.8669 17.5757 14.8617 18.2528 13.706 18.7518C12.5503 19.2506 11.3156 19.5 10.0017 19.5ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#666666" />
            </svg>
        </div>
    )
}

const Check: FC<{ checked: boolean,onClick:()=>void }> = ({ checked,onClick }) => {
    return (
        <div className="msf" onClick={onClick}>
            {checked ? <CheckIcon /> : <UncheckIcon />}
        </div>
    )
}
const UncheckIcon: FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="#898A8F" />
        </svg>
    )
}
const CheckIcon: FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="#007AFF" />
            <path d="M10.5804 15.58C10.3804 15.58 10.1904 15.5 10.0504 15.36L7.22043 12.53C6.93043 12.24 6.93043 11.76 7.22043 11.47C7.51043 11.18 7.99043 11.18 8.28043 11.47L10.5804 13.77L15.7204 8.63001C16.0104 8.34001 16.4904 8.34001 16.7804 8.63001C17.0704 8.92001 17.0704 9.40001 16.7804 9.69001L11.1104 15.36C10.9704 15.5 10.7804 15.58 10.5804 15.58Z" fill="#007AFF" />
        </svg>
    )
}