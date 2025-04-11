import { mdiReload } from "@mdi/js"
import Icon from "@mdi/react"
import { FC } from "react"

const ReTry: FC<{ text: string, onClick: () => void }> = ({ text, onClick }) => {
    return (
        <div className="fullscreen- flex-col- align-vh- bg-d-20- z-1- bf-1-">
            <div className="flex-1-"></div>
            <div className="flex-1- flex-col- align-vh-">
                <div className="msf">{text}</div>
                <button className="button-4" onClick={onClick}><Icon path={mdiReload} size={0.8} />تلاش مجدد</button>
            </div>
        </div>
    )
}

export default ReTry