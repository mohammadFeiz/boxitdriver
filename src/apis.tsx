import AIOApis from "aio-apis";
import { I_consignment, I_consignmentLocationTimes, I_shift } from "./types";

export class Apis extends AIOApis {
    base_url: string;
    mock: boolean = true;
    mockDelay: number = 2000;
    constructor(p: { token: string, base_url: string }) {
        super({
            id: 'boxitdriver',
            token: p.token, lang: 'fa',
            handleErrorMessage: () => 'error'
        })
        this.base_url = p.base_url
    }
    getConsignments = async (date: number[]) => {
        const { success, response } = await this.request<{ data: I_consignment[] }>({
            name: 'getConsignments',
            method: 'get',
            url: `${this.base_url}/getConsignments`,
            description: 'دریافت لیست مرسوله ها',
            body: { date },
            mock: this.mock ? this.getConsignments_mock : undefined,
            mockDelay: this.mockDelay
        })
        if (success) { return response.data }
        else { return false }

    }
    getTimesByParsiMap = async (consignments: I_consignment[]) => {
        if (this.mock) {
            const res: I_consignmentLocationTimes = {}
            for (let consignment of consignments) {
                const time = new Date().getTime();
                res[consignment.id.toString()] = { consignment, time }
            }
            return res
        }
        else {
            return false 
        }

    }
    getCODsAmounts = async (cods: I_consignment[]) => {
        return {
            product: 1250000,
            send: 150000,
            total: 1400000
        }
    }
    codsPayment = async (cods: I_consignment[]) => {
        return true
    }
    priorityByParsiMap = async (consignments: I_consignment[]) => {
        if (this.mock) { return this.priorityByParsiMap_mock(consignments) }
        return consignments
    }
    sendNewPriority = async (consignments: I_consignment[]) => {
        const { success } = await this.request({
            name: 'priorityByParsiMap',
            method: 'post',
            url: `${this.base_url}/priorityByParsiMap`,
            description: 'ارسال اولویت بندی به سرور',
            mock: this.mock ? () => this.sendNewPriority_mock(consignments) : undefined,
            mockDelay: this.mockDelay
        })
        if (success) { return true }
        else { return false }
    }
    getShifts = async (date:number[])=>{
        const {response,success} = await this.request<{data:I_shift[]}>({
            name:'',
            description:'دریافت شیفت ها',
            method:'post',
            url:`${this.base_url}/getShifts`,
            body:{date},
            mock:this.mock?this.getShifts_mock:undefined,
            mockDelay:this.mockDelay
        })
        if(success){return response.data}
        else {return false}
    }
    private getConsignments_mock = () => {
        //return {status:400,data:{}}
        const data: I_consignment[] = [
            {
                id: 0,
                lat: 0, lng: 0,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "delivary_pending",
                type: 'delivery',
                number: '6455235465',
                shift: 'شیفت 1',
                tag_ehrazeHoviat: true,
                isCod: true
            },
            {
                id: 1,
                lat: 0, lng: 0,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "pickup_pending",
                type: 'pickup',
                number: '8566456456',
                shift: 'شیفت 1',
                tag_hazineYeKala: true
            },
            {
                id: 2,
                lat: 0, lng: 0,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "delivary_success",
                type: 'delivery',
                number: '7674645634',
                shift: 'شیفت 1'
            },
            {
                id: 3,
                lat: 0, lng: 0,
                address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
                receiver: 'سها مرتضایی',
                description: 'لطفا در ساعت اداری مراجعه کنید.',
                status: "pickup_unsuccess",
                type: 'pickup',
                number: '98545645',
                shift: 'شیفت 1'
            }
        ]
        return { data, status: 200 }
    }
    private priorityByParsiMap_mock = (consignments: I_consignment[]) => {
        return consignments
    }
    private sendNewPriority_mock = (consignments: I_consignment[]) => {
        return { data: undefined, status: 200 }
    }
    private getShifts_mock = ():{data:I_shift[],status:number}=>{
        const data = [
            { 
                hub:{
                    name:'هاب تهران',
                    address:'تهران شریعتی نرسیده به پل رومی',
                    id:12,
                    lat:51.453534,
                    lng:35.45645
                },
                number:'123456',
                timeRange: [8, 11], 
                amount: 12300000, 
                zone: 'میدان انقلاب (هاب نواب)', 
                date: '1404/3/4', 
                id: 0 
            },
            { 
                hub:{
                    name:'هاب تهران',
                    address:'تهران شریعتی نرسیده به پل رومی',
                    id:12,
                    lat:51.453534,
                    lng:35.45645
                },
                number:'123456',
                timeRange: [8, 11], 
                amount: 12300000, 
                zone: 'میدان انقلاب (هاب نواب)', 
                date: '1404/3/4', 
                id: 1 
            },
            { 
                hub:{
                    name:'هاب تهران',
                    address:'تهران شریعتی نرسیده به پل رومی',
                    id:12,
                    lat:51.453534,
                    lng:35.45645
                },
                number:'123456',
                timeRange: [8, 11], 
                amount: 12300000, 
                zone: 'میدان انقلاب (هاب نواب)', 
                date: '1404/3/4', 
                id: 2 
            },
            { 
                hub:{
                    name:'هاب تهران',
                    address:'تهران شریعتی نرسیده به پل رومی',
                    id:12,
                    lat:51.453534,
                    lng:35.45645
                },
                number:'123456',
                timeRange: [8, 11], 
                amount: 12300000, 
                zone: 'میدان انقلاب (هاب نواب)', 
                date: '1404/3/4', 
                id: 3 
            },

        ]
        return {data,status:200}
    }
}