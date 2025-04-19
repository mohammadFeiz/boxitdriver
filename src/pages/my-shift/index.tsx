import { FC, ReactNode, useState } from "react";
import { useTimeline } from "../../components/timeline";
import { I_consignment, I_shift, I_shiftsHook } from "../../types";
import ArrowButton from "../../components/arrow-button";
import { SplitNumber } from "aio-utils";
import TimeRange from "../../components/time-range";
import Pair from "../../components/pair";
import AIMap from "aio-map";
import usePopup from "aio-popup";
import FooterButtons from "../../components/footer-buttons";
import { MyShiftProvider, useMyShiftContext } from "./context";
import { AICheckbox } from "aio-input";
import { useAppContext } from "../../context";
import { useShifts } from "./useShifts";
import ScanRow from "../../components/scan-item";
import ScanInput from "../../components/scan-input";
type I_activeItems = {[id:string]:I_consignment | undefined}
const MyShift: FC = () => {
    const {apis} = useAppContext()
    const popup = usePopup()
    const shiftsHook = useShifts(apis)
    const timelineHook = useTimeline((newDate)=>shiftsHook.getShifts(newDate))
    const [activeItems,SetActiveItems] = useState<I_activeItems>({})
    const setActiveItem = (consignment:I_consignment)=>{
        const isActive = !!activeItems[consignment.id.toString()]
        const newActiveItems:I_activeItems = {...activeItems,[consignment.id.toString()]:isActive?undefined:consignment}
        SetActiveItems(newActiveItems)
    }
    const openDetailsModal = (shift: I_shift) => {
        popup.addModal({
            header: { title: 'جزییات شیفت' },
            body: <ShiftDetails shift={shift} onReject={async () => { }} />
        })
    }
    const openScanModal = () => {
        popup.addModal({
            header: { title: 'بارگذاری بسته‌ها' },
            body: <Scan/>
        })
    }
    return (
        <MyShiftProvider value={{ openDetailsModal, popup, openScanModal,activeItems,setActiveItem }}>
            <div className="app-page flex-col- gap-12-">
                {timelineHook.render()}
                <Shifts shiftsHook={shiftsHook} />
            </div>
            {popup.render()}
        </MyShiftProvider>
    )
}
export default MyShift
const Shifts: FC<{ shiftsHook: I_shiftsHook }> = ({ shiftsHook }) => {
    return (
        <div className="flex-col- gap-12- p-12- flex-1- ofy-auto-">
            {shiftsHook.shifts.map((shift, i) => <ShiftCard key={i} shift={shift} />)}
        </div>
    )
}

const ShiftCard: FC<{ shift: I_shift }> = ({ shift }) => {
    const { openDetailsModal } = useMyShiftContext()
    const pair_layout = (key: string, value: ReactNode) => {
        return (
            <div className="flex-row- align-v- gap-4- h-36-">
                <div className="c-6-">{key}</div>
                <div className="bold-">{value}</div>
            </div>
        )
    }
    return (
        <div className="flex-col- fs-12- brd-c-12- p-12- br-12-">
            <div className="flex-row- brd-c-12- brd-b- align-v- h-36- p-b-12-">
                <div className="bold- flex-1-">{`شماره شیفت : ${shift.number}`}</div>
                <ArrowButton text='جزییات شیفت' onClick={() => openDetailsModal(shift)} />
            </div>
            {pair_layout('مبلغ : ', `${SplitNumber(shift.amount)} ریال`)}
            {pair_layout('ناحیه : ', shift.zone)}
            {pair_layout('ساعت : ', <TimeRange timeRange={shift.timeRange} />)}

        </div>
    )
}

const ShiftDetails: FC<{ shift: I_shift, onReject: () => Promise<void> }> = ({ shift, onReject }) => {
    const { popup, openScanModal } = useMyShiftContext()
    const openRejectModal = () => {
        popup.addModal({
            position: 'bottom',
            header: { title: 'انصراف از توزیع' },
            setAttrs: (key) => {
                if (key === 'modal') { return { className: 'bottom-modal h-fit-' } }
                if (key === 'backdrop') { return { className: 'dark-backdrop' } }
            },
            body: (
                <div className="flex-col- fs-12-">
                    <div className="p-12-">
                        در صورتیکه تا 24 ساعت قبل از شروع شیفت از توزیع منصرف شوید مشمول پرداخت جریمه نخواهید شد.
                    </div>
                    <FooterButtons
                        trueText="انصراف از توزیع مرسوله"
                        canselText="لغو"
                        trueAttrs={{
                            onClick: async () => {
                                await onReject()
                                popup.removeModal()
                            }
                        }}
                        canselAttrs={{
                            onClick: () => {
                                popup.removeModal()
                            }
                        }}
                    />
                </div>
            )
        })
    }
    return (
        <>
            <div className="fs-12- flex-col- gap-12- h-100-">
                <div className="flex-1- ofy-auto- p-12- flex-col- gap-12-">
                    <div className="fs-14-">
                        پس از مراجعه حضوری به هاب زیر، با اسکن مرسولات، شیفت خود را تحویل بگیرید.
                    </div>
                    <div className="brd-c-12- br-12- p-12- flex-col- gap-12-">
                        <div className="flex-row- align-v- brd-c-12- brd-b- h-36- p-b-12-">
                            <div className="flex-1- bold-">{`شماره شیفت : ${shift.number}`}</div>
                            <div className="color-6 bold- fs-14- pointer-" onClick={openRejectModal}>انصراف از توزیع</div>
                        </div>
                        <div className="flex-row- align-v-">
                            <div className="flex-1-"><Pair label='تاریخ :' value={shift.date} dir='v' /></div>
                            <div className="flex-1-"><Pair label='بازه ارسال:' value={<TimeRange timeRange={shift.timeRange} />} dir='v' /></div>
                        </div>
                        <div className="flex-row- align-v-">
                            <div className="flex-1-"><Pair label='مبلغ:' value={`${SplitNumber(shift.amount)} ریال`} dir='v' /></div>
                        </div>
                        <div className="flex-row- align-v-">
                            <div className="flex-1-"><Pair label='آدرس هاب:' value={shift.hub.address} dir='v' /></div>
                        </div>
                        <div className="color-6 flex-row- align-v- fs-14- bold- gap-6-">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0004 11.1916C11.4363 11.1916 12.6004 10.0276 12.6004 8.59164C12.6004 7.1557 11.4363 5.99164 10.0004 5.99164C8.56445 5.99164 7.40039 7.1557 7.40039 8.59164C7.40039 10.0276 8.56445 11.1916 10.0004 11.1916Z" stroke="#4EA2FF" />
                                <path d="M3.01675 7.07502C4.65842 -0.141644 15.3501 -0.133311 16.9834 7.08336C17.9417 11.3167 15.3084 14.9 13.0001 17.1167C11.3251 18.7334 8.67508 18.7334 6.99175 17.1167C4.69175 14.9 2.05842 11.3084 3.01675 7.07502Z" stroke="#4EA2FF" />
                            </svg>
                            مسیر یابی
                        </div>
                        <AIMap
                            value={[shift.hub.lat, shift.hub.lng]}
                            mapStyle={{ height: 240 }}
                            attrs={{ className: 'brd-c-13- br-12- of-hidden-' }}
                            marker={false}
                            dragging={false}
                        />
                    </div>
                </div>
                <FooterButtons
                    trueText='اسکن مرسولات' canselText='لغو'
                    canselAttrs={{ onClick: () => popup.removeModal() }}
                    trueAttrs={{ onClick: () => { openScanModal(); } }}
                />
            </div>
        </>
    )
}

const Scan: FC = () => {
    const [consignments] = useState<I_consignment[]>([
        {id:0,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:1,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:2,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:3,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:4,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:5,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:6,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
        {id:7,number:'12325234',status:{id:0,text:'استتوس1'},shift:'',address:'',receiver:'احسان درودیان',description:'',type:'delivery',lat:0,lng:0},
    ])
    return (
        <div className="fs-12- flex-col- gap-12-">
            <div className="flex-col- p-12- gap-12-">
                <div className="msf">
                    بسته‌های زیر در این شیفت به شما اختصاص داده شده است. بارکد آن ها را با لیست زیر چک کرده و سپس در خودرو خود بارگذاری کنید.
                </div>
                <div className="msf">پس از بارگذاری بسته‌ها، ردیف بارکد آن را تیک بزنید.</div>
                <ScanInput onChange={()=>{}}/>
                <div className="h-1- bg-12- w-100-"></div>
                <ScanedItems items={consignments}/>
            </div>
        </div>
    )
}
const ScanedItems:FC<{items:I_consignment[]}> = ({items})=>{
    const {activeItems,setActiveItem} = useMyShiftContext()
    return (
        <div className="flex-col- gap-12-">
            {items.map((item,i)=><ScanRow key={i} consignment={item} index={i} value={!!activeItems[item.id.toString()]} onChange={()=>setActiveItem(item)}/>)}
        </div>
    )
}
