import AIOApis from "./components/aio-apis";
import { I_amari_report, I_consignment, I_consignmentLocationTimes, I_consignmentType, I_dateShift, I_failedReason, I_listi_report_filter, I_paymentDetail, I_shift, I_user } from "./types";
import { getShifts_mock, priorityByParsiMap_mock } from "./mockApis";
type I_consignmentServer = {
    selectDriverCardType: { id: 0 | 1 },
    selectStatus: { id: number, text: string },
    cprNumber: any,
    receiverAddress: string,
    receiver: string,
    description: string,
    lat: number,
    longitude: number,
    hasPostPaid: boolean,
    hasAuthentication: boolean,
    hasCostOfGoods: boolean,
    pickUpNumber: any,
    selectShift: { text: string, id: number }
}
export class Apis extends AIOApis {
    base_url: string;
    offline: boolean = false;
    driverId: number = 0;
    mock: boolean = true;
    mockDelay: number = 2000;
    constructor(p: { token: string, base_url: string, logout:()=>void }) {
        super({
            id: 'boxitdriver',
            base_url:p.base_url,
            defaults:{token:p.token,messageTime:30},
            lang: 'fa',
            handleErrorMessage: (err) => {
                if (err.response?.status === 401) {p.logout(); return ''}
                try{return err.response.data.messages[0].message}
                catch{
                    try{
                        const message = err.response.data.message;
                        return message
                    }
                    catch{return 'error'}
                }
            }
        })
        this.base_url = p.base_url;
    }
    setDriverId = (driverId:number)=>this.driverId = driverId;
    consignmentServerToClient = (obj: I_consignmentServer) => {
        const type: I_consignmentType = obj.selectDriverCardType.id === 0 ? 'pickup' : 'delivery'
        const res: I_consignment = {
            type,
            status: obj.selectStatus,
            number: type === "delivery" ? obj.cprNumber : obj.pickUpNumber?.text,
            shift: obj.selectShift?.text,
            address: obj.receiverAddress,
            id: type === "delivery" ? obj.cprNumber : obj.pickUpNumber?.text,
            receiver: obj.receiver,
            description: typeof obj.description === 'string' ? obj.description : '',
            lat: obj.lat, lng: obj.longitude,
            isCod: obj.hasPostPaid === true,
            tag_ehrazeHoviat: obj.hasAuthentication === true,
            tag_hazineYeKala: obj.hasCostOfGoods === true
        }
        return res
    }
    fetchUser = async()=>{
        const {success,response} = await this.request<{
            data:{
                driverInfoDto:{
                    driver:{
                        name:string,
                        id:number
                    },
                    selectHub:{
                        id:number,
                        text:string
                    }
                    
                },
                userinfo:{
                    text:string,
                    id:number
                }
            }
        }>({
            name:'',
            description:'دریافت اطلاعات کاربر',
            method:'post',
            url:`/resource-api/permission/fetchPermissionsByUserName`,
            body:{in:''}
        })
        if(success){
            const user:I_user = {
                username:response.data.userinfo.text,
                id:response.data.driverInfoDto.driver.id,
                name:response.data.driverInfoDto.driver.name,
                isActive:true,
                hub:{
                    id:response.data.driverInfoDto.selectHub.id,
                    text:response.data.driverInfoDto.selectHub.text
                }
            }
            return user
        }
        else {
            return false
        }
    }
    getConsignments = async (date: number[]) => {
        const year = '1402'
        const month = '11'
        const day = '29'
        const queryObject = {
            driverId: this.driverId.toString(),
            // year:date[0].toString(),
            // month:date[1].toString(),
            // day:date[2].toString(),
            year,
            month,
            day,
        }
        const { success, response } = await this.request<{ data: { response: I_consignmentServer[] } }>({
            name: 'getConsignments',
            method: 'get',
            queryObject,
            url: `${this.base_url}/consignment-api/driverService/DriverDeliveryPickUpGrid`,
            description: 'دریافت لیست مرسوله ها',
            //mock: this.mock ? getConsignments_mock : undefined,
            //mockDelay: this.mockDelay
        })
        if (success) { return response.data.response.map((o) => this.consignmentServerToClient(o)) }
        else {
            return false
        }

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
        const body: string[] = cods.map((o) => o.number)
        const { response, success } = await this.request<any>({
            name: 'getCODsAmounts',
            description: 'دریافت اطلاعات پرداخت',
            method: 'post',
            url: `${this.base_url}/consignment-api/driverService/driverPaymentInformation`,
            body
        })
        if (success) {
            const send = response.data.response.sentCost;
            const product = response.data.response.costOfGoods;
            const total = send + product;
            const res: I_paymentDetail = { send, product, total }
            return res
        }
        else {
            return false
        }
    }
    codsPayment = async (consignments: I_consignment[], amount: number) => {
        const { success, response } = await this.request<any>({
            name: 'codsPayment',
            description: 'پرداخت پس کرایه ها',
            method: 'post',
            url: `${this.base_url}/consignment-api/driverService/driverPayment/${amount}`,
            body: consignments.map((o) => o.number)
        })
        if (success) { return true }
        else { return false }
    }
    getWeyPoints = async (consignments: I_consignment[]): Promise<string | null> => {
        const res: string[] = consignments.map((o) => `${o.lng},${o.lat}`)
        const currentLocation = await getUserLocation()
        if (currentLocation === null) {
            this.actions.addAlert({
                type: 'error',
                text: 'خطا در دریافت موقعیت مکانی شما',
            })
        }
        else { res.unshift(`${currentLocation.lng},${currentLocation.lat}`) }
        return res.join('|')
    }
    priorityByParsiMap = async (consignments: I_consignment[]): Promise<any> => {
        if (this.mock) { return priorityByParsiMap_mock(consignments) }
        const key = 'p17629b8b76ae143a78ecc70946e02ee65ba0d2b6c'
        const travelMode = 'driving'
        const waypoints = this.getWeyPoints(consignments)
        const { success } = await this.request<{
            data: {
                legs: {
                    distance: { text: string, value: number },
                    duration: { text: string, value: number },
                    start_location: { lat: number, lng: number },
                    end_location: { lat: number, lng: number },
                }[]
            }
        }>({
            name: 'priorityByParsiMap',
            description: 'مرتب سازی موقعیت ها',
            method: 'get', token: undefined,
            url: `https://api.parsimap.ir/direction/optimized-route?key=${key}&travel_mode=${travelMode}&waypoints=${waypoints}&traffic=true`
        })
        if (success) {
            //const legs = response.data.legs
        }
        else { return false }

    }
    changePriority = async (consignments: I_consignment[]) => {
        const body = consignments.map((o) => {
            return {
                type: o.type === "delivery" ? "DELIVERY" : "PICKUP",
                cprNumber: o.number
            }
        })
        const { success } = await this.request({
            name: 'changePriority', method: 'post', body, description: 'ارسال اولویت بندی به سرور',
            url: `${this.base_url}/consignment-api/driverService/changePriority`,
            //mock: this.mock ? () => changePriority_mock(consignments) : undefined,
            // mockDelay: this.mockDelay
        })
        if (success) { return true }
        else { return false }
    }
    pickup_getFailedReasons = async () => {
        const { success, response } = await this.request<{ data: { payload: { name: string, id: number }[] } }>({
            name: 'pickup_getFailedReasons', description: 'دریافت دلایل ناموفق', method: 'get',
            url: `${this.base_url}/consignment-api/failedReasons/pickUpFailedReasonsList`,
            // mock: this.mock ? () => ({ data: [], status: 200 }) : undefined,
            // mockDelay: this.mockDelay
        })
        if (success) {
            const list = response.data.payload;
            const res: I_failedReason[] = list.map((o) => ({ text: o.name, id: o.id }))
            return res
        }
        else { return false }
    }
    pickup_success = async (p: { pickupId: number, count: number }) => {
        const body: { pickUpNumber: number, count: number } = { pickUpNumber: p.pickupId, count: p.count }
        const { success, response } = await this.request<any>({
            name: 'pickup_success',
            description: 'اعلام جمع آوری با تعداد',
            method: 'post',
            url: `${this.base_url}/consignment-api/driverService/pickUpAcceptCount`,
            body,
        })
        if (success) {return true}
        else {return false}
    }
    pickup_failed = async (p: { image?: any, failedReasonId: number, description: string, consignment: I_consignment }) => {
        let imageId:any;
        if(p.image){
            const res = await this.setImage(p.image);
            if(res){imageId = res}
            else {alert('ارسال تصویر نا موفق بود'); return false}
        }
        const body = {
            failedReasonId: p.failedReasonId,
            cprNumberList: [p.consignment.number],
            driverId: this.driverId,
            description: "",
            imageId
        }
        const { response, success } = await this.request<any>({
            name: 'pickup_failed',
            description: 'اعلام جمع آوری نا موفق به سرور',
            method: 'post',
            url: `${this.base_url}/consignment-api/driverService/driverPickUpFailedReason`,
            body
        })
        if (success) {
            return true
        }
        else {
            return false
        }
    }
    delivery_getFailedReasons = async () => {
        const { success, response } = await this.request<{ data: { name: string, id: number }[] }>({
            name: 'delivery_getFailedReasons', description: 'دریافت دلایل ناموفق', method: 'get',
            url: `${this.base_url}/consignment-api/v2/driver/delivery/deliveryFailedReasonsList`,
            // mock: this.mock ? () => ({ data: [], status: 200 }) : undefined,
            // mockDelay: this.mockDelay
        })
        if (success) {
            const res: I_failedReason[] = response.data.map((o) => ({ text: o.name, id: o.id }))
            return res
        }
        else { return false }
    }
    delivery_failed = async (p: { file?: any, failedReasonId: number, description: string, consignments: I_consignment[] }) => {
        let imageId: any;
        if (p.file) {
            const res = await this.setImage(p.file);
            if (res) { imageId = res }
            else {
                alert('ارسال تصویر نا موفق بود')
                return false
            }
        }
        const { response, success } = await this.request<any>({
            queryObject:{
                driverId: this.driverId.toString(),
                failedReasonId: p.failedReasonId.toString(),
                imageId,
                description: p.description
            },
            name: 'delivery_failed', description: 'اعلام علل تحویل نا موفق', method: 'post',
            url: `${this.base_url}/consignment-api/driverService/deliveryFailed`,
            body: p.consignments.map((o) => o.number)
        })
        if (success) { }
        else { }
    }

    delivery_success = async (p: { signature?: any, deliveryCode?: string, nationalCode?: string, description: string, consignments: I_consignment[], driverId: number, image?: any }) => {
        let signatureId: any;
        if (p.signature) {
            const res = await this.setImage(p.signature);
            if (res) { signatureId = res }
            else {
                alert('ارسال امضا نا موفق بود')
                return false
            }
        }
        const { response, success } = await this.request<any>({
            queryObject:{
                driverId: p.driverId.toString(),
                signatureId,
                //description:p.description,
                deliveryCode: p.deliveryCode,
                nationalCode: p.nationalCode
            },
            name: 'delivery_success', description: 'اعلام تحویل موفق', method: 'post',
            url: `${this.base_url}/consignment-api/driverService/delivered`,
            body: p.consignments.map((o) => o.number)
        })
        return !!success
    }
    base64ToFile(base64: any, fileName = 'upload.bin') {
        const arr = base64.split(',');
        const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const bstr = atob(arr[1] || arr[0]); // اگه header نداشت، کل base64 رو بگیر
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new File([u8arr], fileName, { type: mime });
    }
    setImage = async (file: any) => {
        let fd = new FormData();
        fd.append('file', file)
        const { success, response } = await this.request<{ data: { response: { id: string } } }>({
            name: 'upload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: 'post',
            description: 'بارگزاری تصویر', loading: true,
            url: `${this.base_url}/storage-api/indexed-objects/DELIVERY/as-file`,
            body: fd
        })
        return success ? response.data.response.id : false
    }
    getImage = async (id: string) => {
        const { success, response } = await this.request<{ data: any }>({
            name: 'getImageUrl',
            method: 'get',
            description: 'دریافت آدرس تصویر', loading: true,
            url: `${this.base_url}/storage-api/indexed-objects/${id}/as-file`,
        })
        if (success) { return response.data }
        else { return false }
    }
    getMyShifts = async (date:number[])=>{
        const driverId = this.driverId;
        const [year,month,day] = date
        const {success,response} = await this.request<{
            data: {
                response: {
                    price: number,
                    sentPeriod: string,
                    region: string,
                    capacity: number,
                    hubAddress: string,
                    date: string,
                    latitude: number,
                    longitude: number,
                    shiftId:number
                }[]
            }
        }>({
            name:'',
            description:'دریافت شیفت های من',
            method:'get',
            queryObject:{year,month,day,driverId},
            url:`/resource-api/freelancerShiftReservation/v1/s3/driverShiftReservations`,
        })
        if(success){
            const res:I_shift[] = response.data.response.map((o)=>{
                const shift:I_shift = {
                    timeRange:o.sentPeriod,
                    amount:o.price,
                    zone:o.region,
                    date:`${date[0]}/${date[1]}/${date[2]}`,
                    hubAddress:o.hubAddress,
                    hubLat:o.latitude,
                    hubLng:o.longitude,
                    id:o.shiftId
                }
                return shift;
            })
            return res
        }
        else {
            return false
        }
    }
    getShifts = async (user:I_user) => {
        const { response, success } = await this.request<{
            data: {
                response: {
                    price: number,
                    sendPeriod: string,
                    region: string,
                    capacity: number,
                    deliveryRegion: string,
                    date: string,
                    latitude: number,
                    longitude: number,
                    id:number
                }[]
            }
        }>({
            name: '',
            description: 'دریافت شیفت ها',
            method: 'get',
            url: `/resource-api/freelancerShiftPreparation/v1/s3/driverShiftSuggestion/${user.hub.id}`,
        })
        if (success) {
            console.log(response) 
            const dic:{[date:string]:I_shift[]} = {}
            response.data.response.map((o)=>{
                const shift:I_shift = {
                    timeRange:o.sendPeriod,
                    amount:o.price,
                    zone:o.region,
                    date:o.date,
                    hubAddress:o.deliveryRegion,
                    hubLat:o.latitude,
                    hubLng:o.longitude,
                    id:o.id
                }
                dic[shift.date] = dic[shift.date] || []
                dic[shift.date].push(shift)
            }) 
            const res:I_dateShift[] = Object.keys(dic).map((date)=>{
                return {
                    dateArray:date.split('/').map((o)=>parseInt(o)),
                    shifts:dic[date]
                }
            })
            return res
        }
        else { return false }
    }
    shiftAccept = async (shift:I_shift)=>{
        const {success} = await this.request<any>({
            name:'',
            description:'قبول شیفت',
            method:'post',
            url:`/resource-api/freelancerShiftReservation/v1/s3/acceptShift`,
            body:{
                driverId:this.driverId,
                preparationId:shift.id
            }
        })
        if(success){return true}
        else {return false}
    }
    shift_consignments = async (myShift:I_shift)=>{
        const {response,success} = await this.request<{data:{response:number[]}}>({
            name:'shift_consignments',
            description:'دریافت مرسوله های شیفت',
            method:'get',
            queryObject:{driverId:this.driverId,shiftId:myShift.id},
            url:`/consignment-api/driverService/v1/s0/findDriverConsignmentList`
        })
        if(success){
            return response.data.response
        }
        else {
            return false
        }
    }
    shift_scanConsignments = async (shiftId:number,numbers:number[])=>{
        const {response,success} = await this.request<any>({
            name:'shift_scanConsignments',
            description:'اعلام مرسوله های اسکن شده',
            method:'post',
            url:`/consignment-api/driverService/v1/s0/scanConsignment`,
            body:{driverId:this.driverId,shiftId,cprNumberList:numbers}
        })
        if(success){
            debugger
            return true
        }
        else {
            debugger
            return false
        }
    }
    shift_canselDelivery = async (shiftId:number)=>{
        const {response,success} = await this.request<any>({
            name:'shift_canselDelivery',
            description:'انصراف از توزیع مرسوله',
            method:'post',
            url:`/consignment-api/driverService/v1/s0/cancelShift`,
            body:{shiftId,driverId:this.driverId}
        })
        if(success){return true}
        else {return false}
    }
    amariReport = async (p: { from?: string, to?: string }) => {
        const res: I_amari_report = {
            delivery: {
                total: 10,
                pending: 4,
                success: 3,
                failed: 3
            },
            pickup: {
                total: 20,
                pending: 10,
                success: 6,
                failed: 4
            },
            bag: {
                total: 5,
                pending: 2,
                success: 2,
                failed: 1
            }
        }
        return res
    }
    listiReport = async (filter: I_listi_report_filter) => {
        return []
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
    } 
    catch (err) {
        console.error("Failed to get location:", err);
        return null;
    }
}
