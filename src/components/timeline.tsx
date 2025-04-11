import AIODate from "aio-date";
import { FC, ReactNode, useState } from "react";
import * as svgs from './../assets/svgs';
import { I_timelineHook } from "../types";
type I_day = {
    weekday:string,
    day:number,
    month:number
}
export const useTimeline = (update:(newDate:number[])=>void):I_timelineHook=>{
    const [date,setDate] = useState<number[]>(new AIODate().getToday(true))
    const change = (newDate:number[])=>{
        setDate(newDate)
        update(newDate)
    }
    const render = ()=><Timeline date={date} onChange={(newDate)=>change(newDate)}/>
    return {getDate:()=>date,render}
}
const Timeline:FC<{date:number[],onChange:(newDate:number[])=>void}> = ({date,onChange})=>{
    const DATE = new AIODate()
    function getDays(){
        return [getDay(-48),getDay(-24),getDay(0),getDay(24),getDay(48)]
    }
    function getDay(offset:number):I_day{
        const newDate = offset === 0?date:DATE.getNextTime(date,offset * 60 * 60 * 1000);
        const day = newDate[2]
        const month = newDate[1]
        const weekday = DATE.getWeekDay(date).weekDay
        return {weekday,day,month}
    }
    return (
        <div className="timeline">
            <TimelineArrow dir={-1} onClick={()=>onChange(DATE.getNextTime(date,-24 * 60 * 60 * 1000))}/>
            {getDays().map((day,i)=><TimelineItem key={i} date={day} active={i === 2}/>)}
            <TimelineArrow dir={1} onClick={()=>onChange(DATE.getNextTime(date,24 * 60 * 60 * 1000))}/>
        </div>
    )
}
const TimelineItem:FC<{date:I_day,active:boolean}> = ({date,active})=>{
    return (
        <div className={`timeline-item${active?' active':''}`}>
            <div className="timeline-item-day">{date.day}</div>
            <div className="timeline-item-weekday">{date.weekday}</div>
            <div className="timeline-item-month">{new AIODate().getMonths(true)[date.month - 1]}</div>
        </div>
    )
}
const TimelineArrow:FC<{dir:number,onClick:()=>void}> = ({dir,onClick})=>{
    const icon = dir === 1?<svgs.timeline_arrow_left/>:<svgs.timeline_arrow_right/>
    return (
        <div className="timeline-arrow" onClick={onClick}>
            {icon}
        </div>
    )
}