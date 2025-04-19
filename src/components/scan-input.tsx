import { FC, useState } from "react"

const ScanInput: FC<{ onChange: (v:string)=>void }> = ({ onChange }) => {
    const [value, setValue] = useState<string>('')
    const change = (v:string)=>{
        setValue(v)
        onChange(v)
    }
    return (
        <div className="flex-col- fs-12- gap-6-">
            <div className="">اسکن شماره مرسوله</div>
            <div className="flex-row- align-v- brd-c-12- br-6- h-36- p-h-12-">
                <input 
                    type='text' value={value} placeholder="شماره مرسوله را اسکن و یا وارد کنید"
                    onChange={(e) => change(e.target.value)} 
                    className="brd-none- flex-1-"
                />
                <div className="flex-row- align-vh-">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.41667 6.66669V10" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.47331 6.66669V10" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.527 6.66669V10" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.83333 17.5H5C3.61929 17.5 2.5 16.3807 2.5 15V14.1667" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.168 2.5H15.0013C16.382 2.5 17.5013 3.61929 17.5013 5V5.83333" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.5 5.83333V5C2.5 3.61929 3.61929 2.5 5 2.5H5.83333" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.5013 14.1667V15C17.5013 16.3807 16.382 17.5 15.0013 17.5H14.168" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.41667 12.5V14.1667" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.47331 12.5V14.1667" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.527 12.6042V14.1667" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.5846 12.6042V14.1667" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.5846 6.66669V10" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.33203 9.99998H16.6654" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>
            </div>
        </div>
    )
}
export default ScanInput