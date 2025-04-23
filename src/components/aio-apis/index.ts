import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Loading } from 'aio-popup';
import { Stall, Storage, AddQueryParamsToUrl } from 'aio-utils';
import AIODate from 'aio-date';
import { useRef } from 'react';


export type AA_api = {
    //globallies
    token?: string,loader?: string, retries?: number[],loading?: boolean,mockDelay?: number,headers?: any,showError?: boolean,messageTime?:number
    //privates
    description: string,
    name: string,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    url: string,
    body?: any,
    cache?: { name: string, expiredIn?: number },
    mock?: (obj: any) => { status: number, data: any },
    loadingParent?: string,
    queryObject?: { [key: string]: any },
    lastSuccess?: {
        enable: boolean,
        expiredIn?: number,
        saveCondition?: (p: { response: any }) => boolean,
        loadIn?: 'unsuccess' | 'always',
    },
}
type AIOApisReturnType<T> = { success: boolean, response: T, errorMessage: string,isNetworkError:boolean }
type I_cachedApi = {api: AA_api,response: any}
type I_defaultKeys = 'token' | 'loader' | 'retries' | 'loading' | 'mockDelay' | 'headers' | 'showError' | 'messageTime'
export default class AIOApis {
    private props: {
        defaults:{[key in I_defaultKeys]?:any},
        id: string,
        handleErrorMessage: (err: any, api: AA_api) => string,
        lang?: 'en' | 'fa',
        base_url?: string,
        onBeforeRequest?: <T>(api: AA_api) => Promise<{ api?: AA_api, result?: AIOApisReturnType<T> }>,
        onAfterRequest?: <T>(result: AIOApisReturnType<T>,api: AA_api) => Promise<AIOApisReturnType<T>>,
    };
    private token: string = '';
    private lsc: LastSuccess;
    private currentError: string = '';
    private cache: Cache;
    private status:{[apiName:string]:AIOApisReturnType<any>} = {}
    actions: {
        getNow: () => number[],
        setToken: (token: string) => void,
        getToken: () => string | undefined,
        getStatus:()=>AIOApisReturnType<any> | undefined,
        addAlert: (p: { type: 'success' | 'error' | 'warning' | 'info', title?: string, text: string, time?: number }) => void,
        queryObjectToQueryString: (params?: { [key: string]: string | undefined } | string) => string,
        getCachedResponse: (cacheName:string)=>any
        fetchCacheByName: (cacheName:string)=>Promise<boolean>
        removeCache: (cacheName: string)=>void
    }
    private apisThatAreInLoadingTime: { [apiName: string]: boolean | undefined } = {}
    private DATE: AIODate = new AIODate()
    constructor(props: {
        defaults:{[key in I_defaultKeys]?:any},
        id: string,
        handleErrorMessage: (err: any, api: AA_api) => string,
        lang?: 'en' | 'fa',
        base_url?: string,
        onBeforeRequest?: (api: AA_api) => Promise<{ api?: AA_api, result?: any }>,
        onAfterRequest?: <T>(result: AIOApisReturnType<T>,api: AA_api) => Promise<AIOApisReturnType<T>>,
    }) {
        console.log('aio-apis constructor')
        this.props = props
        const storage = new Storage(props.id);
        this.cache = new Cache(storage, this.callCachedApi.bind(this));
        this.lsc = new LastSuccess(props.id);
        this.actions = {
            getNow: this.getNow.bind(this),
            setToken: this.setToken.bind(this),
            getToken: this.getToken.bind(this),
            getStatus: this.getStatus.bind(this),
            addAlert: this.addAlert.bind(this),
            queryObjectToQueryString: this.queryObjectToQueryString.bind(this),
            getCachedResponse: this.cache.getCachedResponse,
            fetchCacheByName: this.cache.fetchCacheByName,
            removeCache: this.cache.removeCache,

        }
    }
    private getStatus = ()=>JSON.parse(JSON.stringify(this.status))
    private getNow = (jalali?: boolean): number[] => {
        return this.DATE.getToday(jalali)
    }
    private setToken = (token: string) => Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    private getToken = () => this.token
    private addAlert = (p: { type: 'success' | 'error' | 'warning' | 'info', title?: string, text: string, time?: number }) => {
        let { type, title, text, time } = p;
        Alert({ type, title, text, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' })
    }
    private queryObjectToQueryString = (params?: { [key: string]: string | undefined } | string) => {
        if (typeof params === 'string') { return `/${params}`; }
        else if (typeof params === 'object' && params !== null) {
            const queryString = Object.keys(params)
                .filter(key => params[key] !== undefined)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key] as any)}`)
                .join('&');
            return `?${queryString}`;
        }
        return '';
    }
    private getUrl = (api: AA_api) => {
        let finalUrl: string = api.url;
        if (this.props.base_url) {
            if (finalUrl.indexOf(this.props.base_url) !== 0) {
                finalUrl = this.props.base_url + finalUrl;
            }
        }
        if (api.queryObject) { finalUrl = AddQueryParamsToUrl(finalUrl, api.queryObject) }
        return finalUrl
    }
    private responseToResult = async <T>(api: AA_api): Promise<AIOApisReturnType<T>> => {
        const headers = this.getByDefault(api,'headers')
        const { handleErrorMessage } = this.props;
        if (!handleErrorMessage) {
            const errorMessage = `
                missing onCatch in api: ${api.name},
                you should set onCatch in api or in props of AIOApis    
            `
            return { errorMessage, success: false, response: undefined as any,isNetworkError:false }
        }
        try {
            const url = this.getUrl(api);
            let response:T = await Axios({ method: api.method, url, data: api.body, headers: headers === false ? undefined : headers })
            return { success: true, response, errorMessage: '',isNetworkError:false }
        }
        catch (response: any) {
            try {
                let errorMessage = await handleErrorMessage(response, api)
                let isNetworkError:boolean = isNetworkDisconnected(response);
                return { errorMessage, success: false, response,isNetworkError }
            }
            catch (err: any) { return { errorMessage: err.message, success: false, response,isNetworkError:false } }
        }
    }
    private loading = (api: AA_api, state: boolean) => {
        const { name, loadingParent } = api;
        const loading = this.getByDefault(api,'loading')
        const loader = this.getByDefault(api,'loader')
        if (loading) {
            const aioLoading = new Loading(loader)
            aioLoading[state ? 'show' : 'hide'](name, loadingParent)
        }
    }
    private handleMock = (api: AA_api) => {
        if (!api.mock) { return }
        const mockDelay = this.getByDefault(api,'mockDelay')
        const mock = new MockAdapter(Axios);
        mock.resetHandlers();
        if (api.method === 'get') {
            mock.onGet(api.url).replyOnce((config: any) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (!api.mock) { return }
                        const { status, data } = api.mock(config)
                        resolve([status, data]);
                        mock.restore();
                    }, mockDelay);
                });
            });
        }
        else {
            mock.resetHandlers();
            mock.onPost(api.url).replyOnce((config: any) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (!api.mock) { return }
                        const { status, data } = api.mock(config)
                        resolve([status, data]);
                        mock.restore();
                    }, mockDelay);
                });
            });
        }
    }
    private getByDefault = (api:AA_api,key:I_defaultKeys)=>{
        if(api[key] !== undefined){return api[key]}
        if(this.props.defaults[key] !== undefined){return this.props.defaults[key]}
        if(key === "loading"){return true}
        if(key === "mockDelay"){return 2400}
        if(key === "showError"){return true}
    }
    private callCachedApi:I_callCachedApi = async (api) => {
        if (this.apisThatAreInLoadingTime[api.name]) { return {success:false,response:undefined} }
        this.setToken(this.getByDefault(api,'token'))
        this.handleMock(api)
        this.apisThatAreInLoadingTime[api.name] = true;
        let { success, response } = await this.responseToResult(api);
        this.apisThatAreInLoadingTime[api.name] = false
        return {response,success}
    };
    private requestFn = async <T>(api: AA_api, isRetry?: boolean): Promise<AIOApisReturnType<T>> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return { success: false, response: {} as any, errorMessage: 'request is in loading',isNetworkError:false } }
        const {onAfterRequest = (result:AIOApisReturnType<T>)=>result} = this.props
        const lasSuccessRes:T = this.lsc.get(api, 'always')
        if (lasSuccessRes !== null) { return { success: true, response: lasSuccessRes,errorMessage:'',isNetworkError:false } }
        this.setToken(api.token || this.props.defaults.token || '')
        this.handleMock(api)
        if (api.cache) {
            let cachedResponse = this.cache.getCachedResponse(api.cache.name);
            if (cachedResponse !== undefined) { return { success: true, response: cachedResponse,errorMessage:'',isNetworkError:false } }
        }
        else { this.cache.removeCache(api.name) }
        this.loading(api, true); this.apisThatAreInLoadingTime[api.name] = true;
        if (this.props.onBeforeRequest) {
            const { api: newApi, result } = await this.props.onBeforeRequest<T>(api);
            if (result) { return result }
            if (newApi) { api = newApi }
        }
        const status = await this.responseToResult<T>(api);
        this.status[api.name] = status
        const { errorMessage, success, response,isNetworkError } = status
        this.loading(api, false); this.apisThatAreInLoadingTime[api.name] = false;
        if (!success) {
            const lasSuccessRes = this.lsc.get(api, 'unsuccess')
            if (lasSuccessRes !== null) {
                console.log(`api ${api.name} provide last success response`)
                return { success: true, response: lasSuccessRes,errorMessage:'',isNetworkError }
            }
            let message: string | false = errorMessage;
            const showError = this.getByDefault(api,'showError')
            if (!showError) { message = false }
            if (typeof message === 'string') {
                this.currentError = message
                if (!isRetry) {
                    let title: string = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
                    const messageTime = this.getByDefault(api,'messageTime')
                    if (showError) {this.addAlert({ type: 'error', title, text: message,time:messageTime });}
                }
            }
        }
        else {
            this.lsc.set(api, response)
            if (api.cache) { this.cache.setCache(api.cache.name, { api, response }) }
        }
        const result = await onAfterRequest<T>({ response, success, errorMessage,isNetworkError },api)
        return result;
    };
    private retries = async <T>(api: AA_api, times: number[]): Promise<AIOApisReturnType<T>> => {
        const retries = [0, ...times] as number[]
        return await new Promise(async (resolve) => {
            for (let i = 0; i < retries.length; i++) {
                await Stall(retries[i])
                if (i < retries.length - 1) {
                    const res = await this.requestFn<T>(api, true)
                    if (res.success === true) { return resolve(res); break; }
                    else {
                        console.log(`aio-apis => retries[${i}] failed`)
                        console.log(`api error is : ${this.currentError}`)
                    }
                }
                else {
                    const res = await this.requestFn<T>(api)
                    return resolve(res)
                }
            }
        })
    }
    request = async <T>(api: AA_api): Promise<AIOApisReturnType<T>> => {
        const retries = this.getByDefault(api,'retries')
        if (retries) { return await this.retries(api, retries) }
        else { return await this.requestFn<T>(api) }
    }


}
class LastSuccess {
    private storage: Storage;
    constructor(id: string) {
        this.storage = new Storage(id + '-last-success')
    }
    private isEnable = (api: AA_api) => !!api.lastSuccess && !!api.lastSuccess.enable
    private getFromStroage = (api: AA_api) => {
        const { expiredIn } = api.lastSuccess || {}
        const value = this.storage.load(api.name, null, expiredIn)
        return value === undefined ? null : value
    }
    get = (api: AA_api, type: 'always' | 'unsuccess') => {
        const { enable, expiredIn, loadIn = 'unsuccess' } = api.lastSuccess || {}
        if (!this.isEnable(api)) { return null }
        if (type === 'always' && loadIn === 'always') { return this.getFromStroage(api) }
        if (type === 'unsuccess' && loadIn === 'unsuccess') { return this.getFromStroage(api) }
        return null
    }
    set = (api: AA_api, response: any) => {
        if (!this.isEnable(api)) { return }
        if (api.lastSuccess?.saveCondition) {
            const { saveCondition } = api.lastSuccess
            const cond = saveCondition({ response })
            if (!cond) { return }
        }
        this.storage.save(api.name, response, api.lastSuccess?.expiredIn)
    }
}
export type I_mock = {
    url: string, delay: number,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    result: ((body: any) => { status: number, data: any })
}
type I_callCachedApi = (api:AA_api)=>Promise<{success:boolean,response:any}>
class Cache {
    private storage: Storage;
    private callApi:I_callCachedApi;
    constructor(storage: Storage, callApi:I_callCachedApi) {
        this.storage = storage;
        this.callApi = callApi;
    }
    private updateCacheByKey = async (cacheName: string):Promise<boolean> => {
        if (this.storage.isExpired(cacheName)) { this.storage.remove(cacheName); return false; }
        const cachedApi = this.storage.load(cacheName); 
        if (!cachedApi) { return false}
        const { api } = cachedApi; 
        if (!api.cache) { return false}
        const {success,response} = await this.callApi(cachedApi);
        if(success){
            const newCachedApi: I_cachedApi = { api: cachedApi.api, response }
            this.setCache(api.cache.name as string, newCachedApi)
            return true
        }
        return false
    }
    setCache = (cacheName: string, cachedApi: I_cachedApi) => {
        const expiredIn = cachedApi.api.cache?.expiredIn;
        this.storage.save(cacheName, cachedApi, expiredIn);
    }
    getCachedResponse = (cacheName: string): any => {
        let cachedApi = this.storage.load(cacheName);
        if (cachedApi !== undefined) { return cachedApi.value }
    }
    fetchCacheByName = async (cacheName: string):Promise<boolean> => await this.updateCacheByKey(cacheName)
    removeCache = (cacheName: string) => this.storage.remove(cacheName)
}
export const CreateInstance = <T,>(inst: T): T => {
    let res = useRef<T | null>(null)
    if (res.current === null) {res.current = inst}
    return res.current
}
async function isOnline(): Promise<boolean> {
    try {
        const res = await fetch("https://www.google.com/generate_204", {
            method: "GET",
            cache: "no-store",
        })
        return res.status === 204
    } catch (err) {
        return false
    }
}


function isNetworkDisconnected(error: any): boolean {
    if (!error) return false;

    // اگر fetch بوده
    if (typeof error.message === 'string' && error.message.includes('Failed to fetch')) {
        return true;
    }

    // اگر axios بوده
    if (error.isAxiosError && error.message === 'Network Error') {
        return true;
    }

    // اگر response اصلاً وجود نداشته باشه، یعنی request به سرور نرفته
    if (error.request && !error.response) {
        return true;
    }

    return false;
}
