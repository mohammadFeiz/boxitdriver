import AIODate from "aio-date";
import { Get2Digit } from "aio-utils";
import { FC } from "react";

const TimeBox:FC<{type:'milisecondsDate' | 'timeArray' | 'timeString',value:any}> = ({type,value})=>{
    const getTimeString = ()=>{
        if(type === 'timeString'){return value}
        if(type === 'timeArray'){return `${Get2Digit(value[0])} : ${Get2Digit(value[1])}`}
        const dateArray = new AIODate().convertToArray(value);
        return `${Get2Digit(dateArray[3])} : ${Get2Digit(dateArray[4])}`
    }
    return (
        <div className="ltr- time-box">{getTimeString()}</div>
    )
}
export default TimeBox