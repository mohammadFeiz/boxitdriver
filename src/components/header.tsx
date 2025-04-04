import { FC } from "react";
import * as svgs from './../assets/svgs';
import { useAppContext } from "../context";
export const Header: FC = () => {
    const { user,searchAction } = useAppContext();
    return (
        <header className="app-header">
            <div className="app-header-row">
                <div className="flex-row- align-vh-">
                    <svgs.header_profile />
                </div>
                <div className="flex-col- flex-1- h-100- align-v-">
                    <div className="fs-14-">{user.name}</div>
                    <div className="fs-12- op-80-">{user.hub.text}</div>
                </div>
                <div className="msf" onClick={searchAction.click}>
                    <svgs.header_magnify />
                </div>
            </div>
        </header>
    )
}