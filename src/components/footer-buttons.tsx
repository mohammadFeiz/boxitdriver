import { AddToAttrs } from "aio-utils";
import { FC } from "react";

const FooterButtons: FC<{trueAttrs?:any,trueText:string,canselAttrs?:any,canselText?:string}> = ({trueAttrs,canselAttrs,trueText,canselText = 'لغو'}) => {
    const TrueAttrs = AddToAttrs(trueAttrs,{className:'flex-1- button-2'})
    const CanselAttrs = AddToAttrs(canselAttrs,{className:'flex-1- button-1'})
    return (
        <div className="w-100- flex-row- gap-12- align-v- p-12- shadow-top">
            <button {...TrueAttrs}>{trueText}</button>
            {!!canselText && <button {...CanselAttrs}>{canselText}</button>}
        </div>
    )
}
export default FooterButtons