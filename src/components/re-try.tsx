import { mdiExitRun, mdiReload } from "@mdi/js"
import Icon from "@mdi/react"
import { FC } from "react"
import { useAppContext } from "../context"

const ReTry: FC<{ text: string, onClick: () => void }> = ({ text, onClick }) => {
    const { logout } = useAppContext()
    return (
        <div className="fullscreen- flex-col- align-vh- bg-d-20- z-1- bf-1-">
            <div className="flex-1-"></div>
            <div className="flex-1- flex-col- align-vh- gap-24-">
                <div className="msf">{text}</div>
                <div className="flex-col- gap-24- bg-d-10- align-vh- p-24- br-12-">
                    <button className="button-2" onClick={onClick}><Icon path={mdiReload} size={0.8} />تلاش مجدد</button>
                    <button className="button-4 fs-12-" onClick={logout}><Icon path={mdiExitRun} size={0.6} />خروج از حساب</button>
                </div>
            </div>
        </div>
    )
}

export default ReTry