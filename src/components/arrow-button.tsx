import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";

const ArrowButton: FC<{text:string,onClick:any}> = ({text,onClick}) => {
    return (
        <div className="color-6 flex-row- align-v- bold-" onClick={onClick}>
            {text}
            <Icon path={mdiArrowLeft} size={0.8} />
        </div>
    )
}
export default ArrowButton