import { FC, ReactNode, useEffect, useState } from "react";
import { Timeline } from "../../components/timeline";
import { consignmentPriorityDic, I_consignment, I_consignmentPriority } from "../../types";
import { HomeProvider, useHomeContext } from "./context";
import * as svgs from '../../assets/svgs';
import usePopup from "aio-popup";
import { HomeCard } from "../../components/home-card";
import { AISelect, useForm } from "aio-input";
import ImagePlaceholder from "../../components/image-placeholder";
import Icon from "@mdi/react";
import { mdiCarSettings, mdiPin } from "@mdi/js";
import { useAppContext } from "../../context";
import FooterButtons from "../../components/footer-buttons";

const Home: FC = () => {
    const {searchAction} = useAppContext()
    const popup = usePopup()
    const [consignments, setConsignments] = useState<I_consignment[]>([])
    const getConsignments = () => {
        const consignments: I_consignment[] = [
            {
                id:0,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "delivary_pending",
                number: '6455235465',
                shift: 'شیفت 1'
            },
            {
                id:1,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "pickup_pending",
                number: '8566456456',
                shift: 'شیفت 1'
            },
            {
                id:2,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "delivary_success",
                number: '7674645634',
                shift: 'شیفت 1'
            },
            {
                id:3,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "pickup_unsuccess",
                number: '98545645',
                shift: 'شیفت 1'
            }
        ]
        setConsignments(consignments)
    }
    const searchClick = ()=>{
        alert('search in home')
    }
    useEffect(() => {
        getConsignments()
        searchAction.set(()=>searchClick())
    }, [])
    const openDeliveryModal = (consignment: I_consignment) => {
        popup.addModal({
            position: 'bottom',
            setAttrs: (key) => {
                if (key === "modal") { return { className: 'bottom-modal' } }
                if (key === "backdrop") { return { className: 'dark-backdrop' } }
            },
            header: { title: 'تحویل مرسوله' },
            body: <DeliveryModal consignment={consignment} />
        })
    }
    return (
        <HomeProvider value={{ consignments, popup, openDeliveryModal }}>
            <div className="app-page">
                <div className="flex-col-">
                    <Timeline />
                    <Counts />
                    <Toolbar />
                </div>
                <Cards />
            </div>
            {popup.render()}
        </HomeProvider>
    )
}
export default Home
type I_cell = { icon: ReactNode, text: string, count: number }
const Counts: FC = () => {
    const { consignments } = useHomeContext();
    const cells: I_cell[] = [
        { icon: <svgs.Icon1 />, text: 'کل', count: 4 },
        { icon: <svgs.Icon2 />, text: 'توضیع', count: 2 },
        { icon: <svgs.Icon3 />, text: 'جمع آوری', count: 2 },
    ]
    return (
        <div className="flex-row- m-12- br-12- of-hidden-">
            {
                cells.map((cell) => {
                    return (
                        <div className="flex-1- align-vh- flex-row- gap-6- fs-12- bg-d-5- h-36-">
                            <div className="flex-row- align-vh-">{cell.icon}</div>
                            <div className="msf">{cell.text}</div>
                            <div className="fs-16- bold-">{cell.count}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}
const Toolbar: FC = () => {
    return (
        <div className="flex-row- p-h-12- h-36- align-v- gap-6-">
            <div className="brd-c-8- w-16- h-16- br-4-"></div>
            <div className="bold- fs-14- flex-1-">انتخاب همه</div>
            <AISelect
                popover={{
                    position:'bottom',
                    header:{
                        title:'اولویت بندی'
                    },
                    setAttrs:(key)=>{
                        if(key === 'modal'){return {className:'bottom-modal bottom-dropdown'}}
                        if(key === 'backdrop'){return {className:'dark-backdrop'}}
                    }
                }}
                className="bg-3 brd-none- br-8- flex-row- align-v- gap-6- h-36- p-h-12- w-fit-"
                options={['pin','driver']} caret={false} before={<svgs.Icon4 />} text='اولویت بندی'
                option={{
                    text:(option:I_consignmentPriority)=>consignmentPriorityDic[option],
                    value:(option)=>option,
                    before:(option)=><Icon path={option === 'driver'?mdiCarSettings:mdiPin} size={0.8}/>
                }}
            />
        </div>
    )
}
const Cards: FC = () => {
    const { consignments } = useHomeContext()
    return (
        <div className="p-12- flex-col- gap-12- flex-1- ofy-auto-">
            {
                consignments.map((o, i) => <HomeCard key={i} consignment={o} index={i} />)
            }
        </div>
    )
}
type I_deliveryModelType = '0' | '1'
type I_deliveryModel = {
    hasCode: boolean,
    code?: string,
    sign: string,
    image?: string,
    type?:I_deliveryModelType,//notice
    nationalCode?:string
}

const DeliveryModal: FC<{ consignment: I_consignment }> = ({ consignment }) => {
    const { number } = consignment;
    const [failed, setFailed] = useState<boolean>(false)
    const typeDic:{[key in I_deliveryModelType]:string} = {
        '0':'نوع اول',
        '1':'نوع دوم'
    }
    const form = useForm<I_deliveryModel>({
        fa:true,
        initData: {
            hasCode: true
        },
        debug:true,
        isRequired:(data,field)=>{
            if(data.hasCode){
                if(field === 'code'){return true}
            }
            else {
                if(field === 'type'){return true}
                if(field === 'nationalCode'){return true}
            }
            return false
        },
        getLayout: (obj) => {
            return {
                className: 'gap-12-',
                v: [
                    {
                        className: 'm-b-12-',
                        h: [
                            { html: 'شماره مرسوله : ' },
                            { html: number }
                        ]
                    },
                    {
                        input: {
                            label: '',
                            field: 'hasCode',
                            type: 'buttons',
                            attrs: { className: 'buttons-1' },
                            options: [{ text: 'کد تحویل دارد', value: true }, { text: 'کد تحویل ندارد', value: false }],
                            option: {
                                className: () => 'flex-1-',
                                justify: () => true
                            }
                        }
                    },
                    {
                        show:!!obj.getData().hasCode,
                        input: { type: 'text', field: 'code', label: 'کد تحویل',requiured:!!obj.getData().hasCode }
                    },
                    {
                        show:!obj.getData().hasCode,
                        input: { 
                            type: 'select', field: 'type', label: 'نوع',
                            options:Object.keys(typeDic),
                            popover:{fitHorizontal:true},
                            option:{
                                text:(option:I_deliveryModelType)=>typeDic[option],
                                value:(option)=>option
                            }
                        }
                    },
                    {
                        show:!obj.getData().hasCode,
                        input: { 
                            type: 'text', field: 'nationalCode', label: 'کد ملی',
                            validateType:"irNationalCode" 
                        }
                    },
                    {
                        input: { type: 'text', field: 'sign', label: 'امضای گیرنده' }//notice
                    },
                    {
                        input: { type: 'image', field: 'image', label: 'انتخاب تصویر',placeholder:<ImagePlaceholder/>}
                    },
                ]
            }
        }
    })
    const getContent = () => {
        if (!!failed) { 
            return (<FailedDelivery consignment={consignment} onSubmit={(data)=>{}} onCansel={()=>setFailed(false)}/>)
        }
        return (
            <>
                <div className="flex-1- ofy-auto- p-12-">
                    {form.renderLayout}
                </div>
                <FooterButtons
                    trueAttrs={{disabled:form.isSubmitDisabled()}}
                    canselAttrs={{onClick:() => setFailed(true)}}
                    trueText='تایید' canselText='عدم تحویل'
                />
            </>
        )
    }
    return (<div className="flex-col- gap-12 fs-12- h-100-">{getContent()}</div>)
}
type I_failedDeliveryModel = {
    image: string,
    reason: string
}
const FailedDelivery: FC<{consignment:I_consignment,onSubmit:(v:I_failedDeliveryModel)=>void,onCansel:()=>void}> = ({consignment,onSubmit,onCansel}) => {
    const {popup} = useHomeContext()
    const {number} = consignment;
    const form = useForm<I_failedDeliveryModel>({
        initData: {},
        isRequired:(data,field)=>{
            if(field === 'reason'){return true}
            return false
        },
        getLayout: () => {
            return {
                v: [
                    {
                        input:{
                            label:`دلیل عدم تحویل مرسوله ${number} را ذکر کنید`,
                            type:'radio',
                            options:[0, 1, 2, 3, 4],
                            field:'reason',
                            option:{
                                text: (option) => [
                                    'عدم حضور مشتری',
                                    'خرابی خودرو/موتور - تصادف کردم',
                                    'مشکل دستگاه پوز',
                                    'موقعیت مکانی اشتباه است- آدرس پیدا نکردم',
                                    'دلایل دیگر'
                                ][option],
                                value: (option) => option,
                                className: () => 'w-100- bold- fs-11-'
                            }
                        }
                    },
                    {
                        className:'w-100-',
                        input: {
                            type:'image',
                            label:`لطفا تصویر موردنظر خود را اضافه کنید:`,
                            attrs:{className: 'brd-c-11- w-100- h-240- br-12-'},
                            deSelect: true,
                            placeholder: <ImagePlaceholder/>,
                            field: 'image'
                        }
                    }
                ]
            }
        }
    })
    return (
        <div className="flex-col- h-100- p-12-">
            <div className="flex-1- ofy-auto-">{form.renderLayout}</div>
            <FooterButtons
                trueAttrs={{disabled:form.isSubmitDisabled(),onClick:()=>{onSubmit(form.data); popup.removeModal()}}}
                trueText="ثبت" canselAttrs={{onClick:()=>onCansel()}}
            />
        </div>
    )
}