import { FC, ReactNode, useEffect, useState } from "react";
import { I_consignment, I_consignmentLocationTime, I_consignmentLocationTimes } from "../types";
import { Splitter } from "./splitter";
import TimeBox from "./time-box";
import { useHomeContext } from "../pages/home/context";
import { useAppContext } from "../context";

const LocationsModal: FC<{ consignments: I_consignment[] }> = ({ consignments }) => {
    const {apis} = useAppContext()
    const [times, setTimes] = useState<I_consignmentLocationTimes>({})
    const getTimes = async () => {
        const res = await apis.getTimesByParsiMap(consignments)
        if(res){setTimes(res)}
    }
    useEffect(() => {
        getTimes()
    }, [])
    return (
        <div className="flex-col- gap-6- p-12-">
            {consignments.map((consignment) => <LocationCard locationTime={times[consignment.id.toString()]} />)}
        </div>
    )
}
export default LocationsModal
const LocationCard: FC<{ locationTime?: I_consignmentLocationTime }> = ({ locationTime }) => {
    if (!locationTime) { return null }
    const {goToNavigate} = useHomeContext()
    const field_layout = (label: string, text: ReactNode, spaceBetween?: boolean) => {
        return (
            <div className="flex-row- gap-6- fs-12-">
                <div className="bold-">{label}</div>
                {!!spaceBetween && <div className="flex-1-"></div>}
                <div className="op-80-">{text}</div>
            </div>
        )
    }

    return (
        <div className="flex-col- brd-2 br-16- p-12- gap-12-">
            <div className="flex-row- align-v-">
                {field_layout('شماره مرسوله : ', locationTime.consignment.number)}
                <div className="flex-1-"></div>
                <button className="button-2 h-24-" onClick={()=>goToNavigate(locationTime.consignment)}>مسیریابی</button>
            </div>
            <Splitter />
            {field_layout('آدرس : ', locationTime.consignment.address)}
            {field_layout('زمان رسیدن : ', <TimeBox type="milisecondsDate" value={locationTime.time} />, true)}
        </div>
    )
}