import { I_usePopup } from "aio-popup"
import { I_consignment } from "../../types"
import FailedReason from "../../components/failed-reason"
import CodePaymentModal from "../../components/cod-payment-modal"
import DeliveryModal from "../../components/delivery-modal"
import LocationsModal from "../../components/location-modal"
import PriorityModal from "../../components/priority-modal"

type I_openFailedModal = (type: 'delivery' | 'pickup', consignments: I_consignment[], multiple: boolean) => void
type I_openPaymentModal = (cods: I_consignment[], onPaymentSuccess: () => void, onFailedDelivery: () => void) => void
type I_openDeliveryModal = (consignments: I_consignment[], multiple: boolean) => void
type I_openLocationsModal = (consignments: I_consignment[]) => void
type I_openPriorityModal = (consignments: I_consignment[]) =>void
export type I_homeModalHook = {
    openFailedModal:I_openFailedModal,
    openPaymentModal:I_openPaymentModal,
    openDeliveryModal:I_openDeliveryModal,
    openLocationsModal:I_openLocationsModal,
    openPriorityModal:I_openPriorityModal,
}
export const useHomeModal = (popup:I_usePopup):I_homeModalHook=>{
    const openFailedModal = (type: 'delivery' | 'pickup', consignments: I_consignment[], multiple: boolean) => {
        if (type === 'delivery') {
            popup.addModal({
                header: { title: 'عدم تحویل' },
                body: (<FailedReason consignments={consignments} multiple={multiple} onSubmit={() => { }} onCansel={() => popup.removeModal()} />)
            })
        }
    }
    const openPaymentModal = (cods: I_consignment[], onPaymentSuccess: () => void, onFailedDelivery: () => void) => {
        popup.addModal({
            position: 'bottom',
            setAttrs: (key) => {
                if (key === "modal") { return { className: 'bottom-modal bottom-modal-height-fit-content' } }
                if (key === "backdrop") { return { className: 'dark-backdrop' } }
            },
            header: { title: 'صورتحساب' },
            body: (<CodePaymentModal popup={popup} cods={cods} onPaymentSuccess={onPaymentSuccess} onFailedDelivery={onFailedDelivery}/>)
        })
    }
    const openDeliveryModal = (consignments: I_consignment[], multiple: boolean) => {
        popup.addModal({
            position: 'bottom',
            setAttrs: (key) => {
                if (key === "modal") { return { className: 'bottom-modal' } }
                if (key === "backdrop") { return { className: 'dark-backdrop' } }
            },
            header: { title: 'تحویل مرسوله' },
            body: (
                <DeliveryModal
                    consignments={consignments} multiple={multiple}
                    onFailedDelivery={() => openFailedModal('delivery', consignments, multiple)}
                />
            )
        })
    }
    const openLocationsModal = (consignments: I_consignment[]) => {
        popup.addModal({
            header: { title: 'زمانبندی مقصد ها' },
            body: <LocationsModal consignments={consignments} />
        })
    }
    const openPriorityModal = (consignments: I_consignment[]) => {
        popup.addModal({
            header: { title: 'اولویت بندی آدرس' },
            body: <PriorityModal consignments={consignments} onClose={() => popup.removeModal()} />
        })
    }
    
    return {
        openFailedModal,
        openPaymentModal,
        openDeliveryModal,
        openLocationsModal,
        openPriorityModal,
    }
}