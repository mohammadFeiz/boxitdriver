import { FC } from "react"
import { I_shift } from "../types"

const TimeRange:FC<{timeRange:I_shift["timeRange"]}> = ({timeRange})=>{
    return <div className="bold-">{`${timeRange[0]} تا ${timeRange[1]}`}</div>
}
export default TimeRange