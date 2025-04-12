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
        if(cods){/**prevent vite build error */}
        return {
            product: 1250000,
            send: 150000,
            total: 1400000
        }
    }
    codsPayment = async (cods: I_consignment[]) => {
        if(cods){/**prevent vite build error */}
        return false
    }
    getWeyPoints = async (consignments:I_consignment[]):Promise<string | null>=>{
        const res:string[] = consignments.map((o)=>`${o.lng},${o.lat}`) 
        const currentLocation = await getUserLocation()
        if(currentLocation === null){
            this.addAlert({
                type: 'error',
                text: 'خطا در دریافت موقعیت مکانی شما',
            })
        }
        else {res.unshift(`${currentLocation.lng},${currentLocation.lat}`)}
        return res.join('|')
    }
    priorityByParsiMap = async (consignments: I_consignment[]):Promise<any> => {
        if (this.mock) { return this.priorityByParsiMap_mock(consignments) }
        const key = 'p17629b8b76ae143a78ecc70946e02ee65ba0d2b6c'
        const travelMode = 'driving'
        const waypoints = this.getWeyPoints(consignments)
        const {success} = await this.request<{
            data:{
                legs:{
                    distance:{text:string,value:number},
                    duration:{text:string,value:number},
                    start_location:{lat:number,lng:number},
                    end_location:{lat:number,lng:number},
                }[]
            }
        }>({
            name:'priorityByParsiMap',
            description:'مرتب سازی موقعیت ها',
            method:'get',token:undefined,
            url:`https://api.parsimap.ir/direction/optimized-route?key=${key}&travel_mode=${travelMode}&waypoints=${waypoints}&traffic=true`
        })
        if(success){
            //const legs = response.data.legs
        }
        else {return false}
        
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
                lat: 35.734111635102636, lng: 51.31181854551543,
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
                lat: 35.77144699302495, lng: 51.34649262617234,
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
                lat: 35.618930589036324, lng: 51.42116581921271,
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
                lat: 35.63762742911838, lng: 51.48056105265559,
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
        if(consignments){/**prevent vite build error */}
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


type Coordinates = { lat: number; lng: number };

export async function getUserLocation(): Promise<Coordinates | null> {
  try {
    // مرحله ۱: چک کن API ها موجود هستن
    if (!navigator.permissions || !navigator.geolocation) {
      console.warn("Geolocation or Permissions API not supported.");
      return null;
    }

    // مرحله ۲: درخواست اجازه برای دسترسی به موقعیت
    const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

    if (permissionStatus.state === "denied") {
      console.warn("Location permission denied by user.");
      return null;
    }

    // مرحله ۳: گرفتن لوکیشن
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (err) {
    console.error("Failed to get location:", err);
    return null;
  }
}