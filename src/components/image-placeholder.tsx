import { FC } from "react"
import * as svgs from './../assets/svgs';
const ImagePlaceholder: FC = () => {
    return (
        <div className="flex-col- align-vh- gap-12-">
            <svgs.image />
            فایل مورد نظر را انتخاب کنید
        </div>
    )
}
export default ImagePlaceholder