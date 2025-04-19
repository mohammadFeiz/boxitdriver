import { AIDate, AIFormInput } from "aio-input"
import { I_dateRange } from "../types"
import { useRef, useState } from "react"

const useDateRange = (onChange: (newDateRange: I_dateRange) => Promise<boolean>) => {
    const [dateRange, setDateRange] = useState<{ from: string | undefined, to: string | undefined }>({ from: undefined, to: undefined })
    const dateRangeRef = useRef<{ from: string | undefined, to: string | undefined }>({ from: undefined, to: undefined })
    dateRangeRef.current = dateRange
    const changeDateRange = async (type: 'from' | 'to', value: string | undefined) => {
        const newDateRange = { ...dateRangeRef.current, [type]: value }
        const res = await onChange(newDateRange)
        if (res) {
            setDateRange(newDateRange)
        }
    }
    const date_layout = (type: 'from' | 'to') => {
        const dateRange = dateRangeRef.current
        return (
            <AIFormInput
                className='flex-1-'
                label={`تاریخ ${type === 'from' ? 'از' : 'تا'}`}
                input={(
                    <AIDate
                        value={dateRange[type]}
                        onChange={(v) => changeDateRange(type, v)}
                        placeholder={' '}
                        jalali={true}
                        after={(
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.66699 1.66667V4.16667" stroke="#ADADAD" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.333 1.66667V4.16667" stroke="#ADADAD" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.91699 7.575H17.0837" stroke="#ADADAD" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.5 7.08334V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08334C2.5 4.58334 3.75 2.91667 6.66667 2.91667H13.3333C16.25 2.91667 17.5 4.58334 17.5 7.08334Z" stroke="#ADADAD" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.0791 11.4167H13.0866" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.0791 13.9167H13.0866" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.99607 11.4167H10.0036" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.99607 13.9167H10.0036" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.91209 11.4167H6.91957" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.91209 13.9167H6.91957" stroke="#ADADAD" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        )}
                    />
                )}
            />
        )
    }
    const render = () => {
        return (
            <div className="flex-row- gap-12- align-v-">
                {date_layout('from')}
                {date_layout('to')}
            </div>
        )
    }
    return {render}
}
export default useDateRange