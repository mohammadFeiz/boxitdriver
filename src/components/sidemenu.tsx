import { Sidenav } from "aio-component-utils";
import * as svgs from './../assets/svgs';
import { FC } from "react";
import { I_usePopup } from "aio-popup";
import { useAppContext } from "../context";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate } from "react-router-dom";
// type AI_Sidenav = {
//     items: AI_sidenavItem[];
//     onChange: (item: AI_sidenavItem) => void;
//     className?: string;
//     style?: any;
//     attrs?: any;
//     rtl?: boolean;
//     indent?: number;
//     header?: (minimize: boolean) => React.ReactNode;
//     value?: string;
//     minimize?: boolean;
// }
// type AI_sidenavItem = {
//     text: React.ReactNode;
//     subtext?: React.ReactNode;
//     value: string;
//     icon?: React.ReactNode;
//     items?: AI_sidenavItem[];
//     onClick?: () => void;
//     after?: React.ReactNode;
//     show?: boolean;
//     render?: () => React.ReactNode;
// }
const AppSide: FC = () => {
    const { user,popup,logout,sidemenuHook } = useAppContext()
    const navigate = useNavigate()
    return (
        <Sidenav
            header={() => {
                return (
                    <div className="flex-col- p-24- gap-12- w-100-">
                        <div className="flex-row- align-v- w-100-">
                            <svgs.header_profile />
                            <div className="flex-1-"></div>
                            <div className="w-36- h-36- flex-row- align-vh-" onClick={()=>popup.removeModal()}>
                                <Icon path={mdiClose} size={0.8} color={'#fff'} />
                            </div>
                        </div>
                        <div className="fs-16- bold-">{user.name}</div>
                        <div className="fs-12- op-70-">{`کد هاب : ${user.hub.id}`}</div>
                    </div>
                )
            }}
            onChange={(v) => {
                if(v.value === 'logout'){
                    logout()
                }
                if(v.value === 'statisticalreport'){
                    navigate('/statisticalreport')
                }
                if(v.value === 'listreport'){
                    navigate('/listreport')
                }
                sidemenuHook.close()
            }}
            items={[
                {
                    text: 'گزارش مرسولات',
                    icon: <svgs.sideReport />,
                    value: 'gozareshemarsoolat',
                    items: [
                        { text: 'گزارش آماری', value: 'statisticalreport' },
                        { text: 'گزارش لیستی', value: 'listreport' }
                    ]
                },
                {
                    text: 'تسویه راننده',
                    icon: <svgs.sideReport />,
                    value: 'tasvieranande'
                },
                {
                    text: 'خروج از حساب',
                    icon: <svgs.logout />,
                    value: 'logout'
                }
            ]}

        />
    )
}


export const useSidemenu = (props: { popup: I_usePopup }) => {
    const open = () => {
        props.popup.addModal({
            id: 'sidemenu',
            position: 'right',
            body: <AppSide />
        })
    }
    const close = () => {
        props.popup.removeModal('sidemenu')
    }
    return { open, close }
}