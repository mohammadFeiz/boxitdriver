import FooterButtons from "./footer-buttons"
import StepNumber from "./step-number"
import * as svgs from './../assets/svgs';
import { FC, useState } from "react";

const PickupModal: FC = () => {
    const [count, setCount] = useState<number>(0)
    return (
        <div className="flex-col-">
            <div className="flex-row- align-v-">
                <div className="msf">تعداد مرسوله :</div>
                <div className="msf">{` ${count} مرسوله`}</div>
                <div className="flex-1-"></div>
                <button className="button-3">اسکن مرسولات <svgs.Icon12 /></button>
            </div>
            <StepNumber value={count} onChange={(v) => setCount(v)} />
            <FooterButtons
                trueAttrs={{ disabled: !count }}
                canselAttrs={{ onClick: () => {} }}
                trueText='تایید جمع آوری' canselText='عدم جمع آوری'
            />
        </div>
    )
}
export default PickupModal