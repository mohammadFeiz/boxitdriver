import { FC, useEffect, useState } from "react";
import { I_dateShift, I_shift } from "../../types";
import AIODate from "aio-date";
import { SplitNumber } from "aio-utils";
import Icon from "@mdi/react";
import { mdiAlertOutline } from "@mdi/js";
import { useAppContext } from "../../context";
import * as svgs from './../../assets/svgs';
import ArrowButton from "../../components/arrow-button";
import HintBox from "../../components/hint-box";
import usePopup from "aio-popup";
import { SuggestionProvider, useSuggestionContext } from "./context";
import TimeRange from "../../components/time-range";
import Pair from "../../components/pair";
import { dateShifts } from "../../mock";
import FooterButtons from "../../components/footer-buttons";

const Suggestions: FC = () => {
    const { user } = useAppContext()
    const popup = usePopup()

    const openShiftModal = (suggestion: I_shift) => {
        popup.addModal({
            header:{title:'رزرو شیفت'},
            body:(<ShiftReserve shift={suggestion} />)
        })
    }
    if (!user.isActive) {
        return (
            <div className="h-100- flex-col- align-vh- gap-24-">
                <Icon path={mdiAlertOutline} size={3} color='#bbb' />
                <div className="fs-14- t-a-center- bold- c-6-">
                    برای مشاهده و رزرو شیفت‌، لازم است اطلاعات کاربری خود را تکمیل کنید و حساب کاربری شما فعال شود.
                </div>
                <div className="color-6 flex-row- align-v- bold- gap-3-">
                    حساب کاربری
                    <svgs.arrowLeft />
                </div>
            </div>
        )
    }
    return (
        <SuggestionProvider value={{ openShiftModal }}>
            <div className="app-page">
                <div className="h-100- ofy-auto- br-16- p-v-12-">
                    {dateShifts.map((ds) => (
                        <ShiftGroup key={`${ds.dateArray[0]}/${ds.dateArray[1]}/${ds.dateArray[2]}`} dateShift={ds} />
                    ))}
                </div>
            </div>
            {popup.render()}
        </SuggestionProvider>
    )
}
export default Suggestions
const ShiftGroup: FC<{ dateShift: I_dateShift }> = ({ dateShift }) => {
    const { dateArray, shifts } = dateShift
    const [dateString] = useState<string>(getDateString)
    function getDateString() {
        const DATE = new AIODate();
        const weekDay = DATE.getWeekDay(dateArray).weekDay;
        const monthString = DATE.getMonths(true)[dateArray[1] - 1];
        return `${weekDay} ${dateArray[2]} ${monthString}`
    }
    return (
        <div className=''>
            <div className="bg-3 h-36- flex-row- align-v- p-h-12- bold- fs-12-">{dateString}</div>
            <div className="flex-col-">
                {shifts.map((shift, i) => <Shift key={i} shift={shift} index={i} />)}
            </div>
        </div>
    )
}
const Shift: FC<{ shift: I_shift, index: number }> = ({ shift, index }) => {
    const {openShiftModal} = useSuggestionContext()
    const [mounted, setMounted] = useState<boolean>(false)
    const { timeRange, amount, zone } = shift;
    useEffect(() => {
        setTimeout(() => {
            setMounted(true)
        }, index * 120)
    }, [])

    return (
        <div className={`flex-col- fs-12- p-12- gap-12- brd-b- brd-c-10- rotate-card-${mounted ? ' mounted-' : ''}`}>
            <div className="flex-row-">
                <div className="msf">بازه ارسال : </div>
                <TimeRange timeRange={timeRange}/>
                <div className="flex-1-"></div>
                <div className="msf">مبلغ : </div>
                <div className="bold-">{`${SplitNumber(amount)} ریال`}</div>
            </div>
            <div className="flex-row-">
                <div className="msf">ناحیه : </div>
                <div className="bold- flex-1- fs-10-">{zone}</div>
                <div className="flex-1-"></div>
                <ArrowButton text='رزرو شیفت' onClick={() => openShiftModal(shift)} />
            </div>
        </div>

    )
}

const ShiftReserve: FC<{ shift: I_shift }> = ({ shift }) => {
    return (
        <div className="flex-col- gap-12- h-100-">
            <div className="flex-1- ofy-auto- p-12- flex-col- gap-12-">
                <div className="fs-12- bold-">
                    این پیشنهاد مطابق برنامه زمانی که انتخاب کرده اید به شما نمایش داده می‌شود.
                </div>
                <div className="flex-col- brd-c-12- p-12- fs-12- gap-12- br-12-">
                    <div className="flex-row-">
                        <Pair label='تاریخ شیفت:' value={shift.date} dir='v'/>
                        <Pair label='بازه ارسال:' value={<TimeRange timeRange={shift.timeRange}/>} dir='v'/>
                    </div>
                    <Pair label='آدرس مرکز توزیع:' value={shift.hub.address} dir='v'/>
                    <ArrowButton text='مشاهده روی نقشه' onClick={() => { }} />
                    <div className="h-1- w-100- bg-12-"></div>
                    <div className="flex-row- bold-">
                        <div className="flex-1- c-8-">دستمزد شیفت :</div>
                        <div className="color-7 fs-14-">{`${SplitNumber(shift.amount)} ریال`}</div>
                    </div>
                </div>
                <HintBox text='درصورت رزرو شیفت نهایتا تا 24 ساعت قبل از شروع بازه می‌توانید درخواست خود را لغو کنید.' />
                <div className="flex-1-"></div>
            </div>
            <FooterButtons
                trueText="قبول شیفت"
                canselText="لغو"
            />
        </div>
    )
}