import { I_consignment, I_shift } from "./types"

export const getConsignments_mock = () => {
    //return {status:400,data:{}}
    const data: I_consignment[] = [
        {
            id: 0,
            lat: 35.734111635102636, lng: 51.31181854551543,
            address: 'میدان انقلاب - خیابان 12 فروردین - خیابان شهدای فجر- پلاک36 - واحد 2',
            receiver: 'سها مرتضایی',
            description: 'لطفا در ساعت اداری مراجعه کنید.',
            status: { id: 0, text: 'در انتظار تحویل' },
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
            status: { id: 0, text: 'در انتظار جمع آوری' },
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
            status: { id: 0, text: 'تحویل موفق' },
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
            status: { id: 0, text: 'جمع آوری موفق' },
            type: 'pickup',
            number: '98545645',
            shift: 'شیفت 1'
        }
    ]
    return { data, status: 200 }
}
export const priorityByParsiMap_mock = (consignments: I_consignment[]) => {
    return consignments
}
export const changePriority_mock = (consignments: I_consignment[]) => {
    if (consignments) {/**prevent vite build error */ }
    return { data: undefined, status: 200 }
}
export const getShifts_mock = (): { data: I_shift[], status: number } => {
    const data = [
        {
            hub: {
                name: 'هاب تهران',
                address: 'تهران شریعتی نرسیده به پل رومی',
                id: 12,
                lat: 51.453534,
                lng: 35.45645
            },
            number: '123456',
            timeRange: [8, 11],
            amount: 12300000,
            zone: 'میدان انقلاب (هاب نواب)',
            date: '1404/3/4',
            id: 0
        },
        {
            hub: {
                name: 'هاب تهران',
                address: 'تهران شریعتی نرسیده به پل رومی',
                id: 12,
                lat: 51.453534,
                lng: 35.45645
            },
            number: '123456',
            timeRange: [8, 11],
            amount: 12300000,
            zone: 'میدان انقلاب (هاب نواب)',
            date: '1404/3/4',
            id: 1
        },
        {
            hub: {
                name: 'هاب تهران',
                address: 'تهران شریعتی نرسیده به پل رومی',
                id: 12,
                lat: 51.453534,
                lng: 35.45645
            },
            number: '123456',
            timeRange: [8, 11],
            amount: 12300000,
            zone: 'میدان انقلاب (هاب نواب)',
            date: '1404/3/4',
            id: 2
        },
        {
            hub: {
                name: 'هاب تهران',
                address: 'تهران شریعتی نرسیده به پل رومی',
                id: 12,
                lat: 51.453534,
                lng: 35.45645
            },
            number: '123456',
            timeRange: [8, 11],
            amount: 12300000,
            zone: 'میدان انقلاب (هاب نواب)',
            date: '1404/3/4',
            id: 3
        },

    ]
    return { data, status: 200 }
}