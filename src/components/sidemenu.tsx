import { Sidenav } from "aio-component-utils";
import * as svgs from './../assets/svgs';
import { FC } from "react";
import { I_usePopup } from "aio-popup";
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
const AppSide:FC = ()=>{
    return (
        <Sidenav
            header={()=>{
                return (
                    <div className="flex-col-">

                    </div>
                )
            }}
            onChange={()=>{

            }}
            items={[
                {
                    text:'گزارش مرسولات',
                    icon:<svgs.sideReport/>,
                    value:'gozareshemarsoolat',
                    items:[
                        {text:'گزارش آماری',value:'gozaresheamari'},
                        {text:'گزارش لیستی',value:'gozareshelisti'}
                    ]
                },
                {
                    text:'تسویه راننده',
                    icon:<svgs.sideReport/>,
                    value:'tasvieranande'
                },
                {
                    text:'خروج از حساب',
                    icon:<svgs.logout/>,
                    value:'logout'
                }
            ]}

        />
    )
}


export const useSidemenu = (props:{popup:I_usePopup})=>{
    const open = ()=>{
        debugger
        props.popup.addModal({
            id:'sidemenu',
            position:'right',
            body:'msf'
        })    
    }
    const close = ()=>{
        props.popup.removeModal('sidemenu')
    }
    return {open,close}
}