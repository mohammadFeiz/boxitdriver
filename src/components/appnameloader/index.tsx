
import { FC } from 'react';
import imagesrc from './../../assets/appname.png';
import logosrc from './../../assets/boxitdriver.png';
import './index.css';
function Loading(){
    return (
        <div className="msfloading1 op-50-" style={{display:"flex",width:282}}>
            <img src={imagesrc} className="msfloading1item" style={{width: 20}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 40}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 28}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 9}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 25}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 15}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 30}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 25}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 11}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 32}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 23}}/>
            <img src={imagesrc} className="msfloading1item" style={{width: 22}}/>
        </div>
    )
}

const Splash:FC = ()=>{
    return (
        <div className="fullscreen- flex-col- align-vh- app-splash gap-36-">
            <img src={logosrc} alt='' width={200} className='app-logo'/>
            <Loading/>
        </div>
    )
}
export default Splash