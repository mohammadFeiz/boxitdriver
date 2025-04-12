import { FC, ReactNode, useEffect, useState } from "react";
import { useTimeline } from "../../components/timeline";
import { consignmentPriorityDic, I_consignment, I_priorityType } from "../../types";
import { HomeProvider, useHomeContext } from "./context";
import * as svgs from '../../assets/svgs';
import usePopup from "aio-popup";
import { HomeCard } from "./home-card";
import { AICheckbox, AISelect } from "aio-input";
import Icon from "@mdi/react";
import { mdiCarSettings, mdiPin } from "@mdi/js";
import { useAppContext } from "../../context";
import useConsignment from "./useConsignment";
import { useHomeModal } from "./useHomeModal";

const Home: FC = () => {
    const { searchAction, apis,setretry } = useAppContext()
    const popup = usePopup()
    const timelineHook = useTimeline((newDate)=>{
        consignmentHook.getConsignments(newDate)
    })
    const consignmentHook = useConsignment(apis)
    const homeModalHook = useHomeModal(popup)
    const searchClick = () => {
        alert('search in home')
    }
    useEffect(() => {
        searchAction.set(() => searchClick())
    }, [])
    const getCodsFromList = (consignments: I_consignment[]) => consignments.filter((o) => o.isCod === true)
    
    const arriveToDestinationButton = (consignments: I_consignment[], multiple: boolean) => {
        const cods = getCodsFromList(consignments)
        if (cods.length) {
            popup.removeModal()
            homeModalHook.openPaymentModal(
                cods,
                () => homeModalHook.openDeliveryModal(consignments, multiple),
                () => homeModalHook.openFailedModal('delivery', consignments, multiple)//notice
            )
        }
        else { homeModalHook.openDeliveryModal(consignments, multiple) }
    }
    const priorityButtonClick = async (type: I_priorityType) => {
        if (type === 'driver') {
            homeModalHook.openPriorityModal(consignmentHook.consignments)
        }
        else if (type === 'pin') {
            const res = await apis.priorityByParsiMap(consignmentHook.consignments)
            if (res) { homeModalHook.openPriorityModal(res) }
        }
    }
    const goToNavigate = (consignment: I_consignment) => {
        const {lat,lng} = consignment
        const url = `http://maps.apple.com/?daddr=${lat},${lng}`;
        window.open(url, '_blank');
    }
    const navigationButtonClick = (consignments: I_consignment[], multiple: boolean) => {
        if (multiple) { homeModalHook.openLocationsModal(consignments) }
        else { goToNavigate(consignments[0]) }
    }
    if(consignmentHook.reTry){
        setretry({text:'',onClick:()=>consignmentHook.getConsignments(timelineHook.getDate())})
        return null
    }
    return (
        <HomeProvider value={{ popup, arriveToDestinationButton, consignmentHook, navigationButtonClick, goToNavigate, priorityButtonClick,homeModalHook }}>
            <div className="app-page">
                <div className="flex-col-">
                    {timelineHook.render()}
                    <Counts />
                    <Toolbar />
                </div>
                <Cards />
                <MultiSelectFooter />
            </div>
            {popup.render()}
        </HomeProvider>
    )
}
export default Home
type I_cell = { icon: ReactNode, text: string, count: number }
const Counts: FC = () => {
    const { consignmentHook } = useHomeContext();
    const [cells,setCells] = useState<I_cell[]>([
        { icon: <svgs.Icon1 />, text: 'کل', count: 0 },
        { icon: <svgs.Icon2 />, text: 'توضیع', count: 0 },
        { icon: <svgs.Icon3 />, text: 'جمع آوری', count: 0 },
    ])
    useEffect(()=>{
        let total = 0,pickup = 0,delivery = 0
        for(let o of consignmentHook.consignments){
            total += 1;
            if(o.type === "delivery"){delivery += 1}
            else if(o.type === "pickup"){pickup += 1}
        }
        const cells: I_cell[] = [
            { icon: <svgs.Icon1 />, text: 'کل', count: total },
            { icon: <svgs.Icon2 />, text: 'توضیع', count: delivery },
            { icon: <svgs.Icon3 />, text: 'جمع آوری', count: pickup },
        ]
        setCells(cells)
    },[consignmentHook.consignments])

    return (
        <div className="flex-row- m-12- br-12- of-hidden-">
            {
                cells.map((cell) => {
                    return (
                        <div className="flex-1- align-vh- flex-row- gap-6- fs-12- bg-d-5- h-36-">
                            <div className="flex-row- align-vh-">{cell.icon}</div>
                            <div className="msf">{cell.text}</div>
                            <div className="fs-16- bold-">{cell.count}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}
const Toolbar: FC = () => {
    const { consignmentHook, priorityButtonClick } = useHomeContext()
    const { isAllSelected, selectAll } = consignmentHook
    const options: I_priorityType[] = ['pin', 'driver']
    return (
        <div className="flex-row- p-b-12- p-h-12- h-48- align-v- gap-6- shadow-bottom">
            <AICheckbox value={isAllSelected()} onChange={() => selectAll()} />
            <div className="bold- fs-14- flex-1-">انتخاب همه</div>
            <AISelect
                popover={{
                    position: 'bottom',
                    header: {
                        title: 'اولویت بندی'
                    },
                    setAttrs: (key) => {
                        if (key === 'modal') { return { className: 'bottom-modal bottom-modal-height-fit-content' } }
                        if (key === 'backdrop') { return { className: 'dark-backdrop' } }
                    }
                }}
                className="bg-3 brd-none- br-8- flex-row- align-v- gap-6- h-36- p-h-12- w-fit-"
                options={options} caret={false} before={<svgs.Icon4 />} text='اولویت بندی'
                option={{
                    text: (option: I_priorityType) => consignmentPriorityDic[option],
                    value: (option: I_priorityType) => option,
                    before: (option: I_priorityType) => <Icon path={option === 'driver' ? mdiCarSettings : mdiPin} size={0.8} />,
                    onClick: (option: I_priorityType) => priorityButtonClick(option)
                }}
            />
        </div>
    )
}
const Cards: FC = () => {
    const { consignmentHook } = useHomeContext()
    const { consignments } = consignmentHook;
    return (
        <div className="p-12- flex-col- gap-12- flex-1- ofy-auto-">
            {
                consignments.map((o, i) => <HomeCard key={i} consignment={o} index={i} />)
            }
        </div>
    )
}

const MultiSelectFooter: FC = () => {
    const { arriveToDestinationButton } = useHomeContext()
    const { consignmentHook, navigationButtonClick } = useHomeContext()
    const { selectedConsignments } = consignmentHook;
    if (!selectedConsignments.length) { return null }

    return (
        <div className="flex-col- p-12- shadow-top">
            <div className="fs-12- p-h-12- p-b-12- flex-row- align-v- gap-6-">
                {`عملیات جمعی برای مرسوله های منتخب`}
                <div className="bold-">{`(${selectedConsignments.length} مرسوله)`}</div>
            </div>
            <div className="flex-row- align-v-">
                <button className='h-36- br-8- bg-2 c-16- p-h-12- brd-none-' onClick={() => arriveToDestinationButton([...selectedConsignments], true)}>به مقصد رسیدم</button>
                <div className="flex-1-"></div>
                <button className="flex-row- align-vh- brd-none- w-36- h-36- br-8- p-0-" onClick={() => navigationButtonClick([...selectedConsignments], true)}><svgs.Icon10 /></button>
            </div>
        </div>
    )
}