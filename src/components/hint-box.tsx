import { mdiInformationSlabCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";

const HintBox: FC<{ text: string }> = ({ text }) => {
    return (
        <div className="flex-row- align-v- gap-12- color-6 border-6 p-12- br-12- bg-8 fs-12-">
            <div className="flex-row- align-vh-">
                <Icon path={mdiInformationSlabCircle} size={1} />
            </div>
            <div className="c-3-">{text}</div>
        </div>
    )
}
export default HintBox