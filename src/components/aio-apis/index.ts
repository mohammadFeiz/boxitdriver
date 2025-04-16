import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Loading } from 'aio-popup';
import { Stall, Storage, AddQueryParamsToUrl } from 'aio-utils';
import AIODate from 'aio-date';
import { useRef } from 'react';

export type AA_api = {
    description: string,
    name: string,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    url: string,
    body?: any,
    loading?: boolean,
    cache?: { name: string, expiredIn?: number },//AA_cache
    mock?: (obj: any) => { status: number, data: any },
    mockDelay?: number,
    headers?: any,
    token?: string,
    showError?: boolean,
    loader?: string, loadingParent?: string,
    retries?: number[],
    queryParams?: { [key: string]: any },
    lastSuccess?: {
        enable:boolean,
        expiredIn?: number,
        saveCondition?: (p:{response: any}) => boolean,
        loadIn?: 'unsuccess' | 'always',
    }
}
type I_cachedApi<T> = {
    api: AA_api,
    value: any,
}
export default class AIOApis {
    props: {
        id: string,
        token: string,
        loader?: string,
        handleErrorMessage: (err: any, api: AA_api) => string | false,
        headers?: any,
        lang?: 'en' | 'fa',
        onBeforeRequest?: (api: AA_api) => Promise<{ api?: AA_api, result?: any }>,
        onAfterRequest?: (api: AA_api, result: { success: boolean, response: any, errorMessage: string }) => { success: boolean, response: any, errorMessage: string } | undefined,
    };
    token: string;
    lsc: LastSuccess;
    currentError: string = '';
    private cache: Cache;
    getCachedValue: Cache["getCachedValue"]
    fetchCachedValue: Cache["fetchCachedValue"]
    removeCache: Cache["removeCache"]
    apisThatAreInLoadingTime: { [apiName: string]: boolean | undefined } = {}
    private DATE: AIODate = new AIODate()
    constructor(props: {
        id: string,
        token: string,
        loader?: string,
        handleErrorMessage: (err: any, api: AA_api) => string,
        headers?: any,
        lang?: 'en' | 'fa'
    }) {
        console.log('aio-apis constructor')
        this.props = props
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, async (cachedApi: I_cachedApi<any>) => await this.callCache(cachedApi.api));
        this.getCachedValue = this.cache.getCachedValue;
        this.fetchCachedValue = this.cache.fetchCachedValue;
        this.removeCache = this.cache.removeCache;
        this.lsc = new LastSuccess(props.id);
    }
    getNow = (jalali?: boolean): number[] => {
        return this.DATE.getToday(jalali)
    }
    setToken = (token: string) => {
        if (token && token === this.token) { Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; }
    }
    addAlert = (p: { type: 'success' | 'error' | 'warning' | 'info', title?: string, text: string, time?: number }) => {
        let { type, title, text, time } = p;
        Alert({ type, title, text, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' })
    }
    getUrlQueryParam = (params?: { [key: string]: string | undefined } | string) => {
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
    private responseToResult = async (api: AA_api): Promise<{ errorMessage?: string, success: boolean, response: any }> => {
        const { headers = this.props.headers } = api;
        const { handleErrorMessage } = this.props;
        if (!handleErrorMessage) {
            const errorMessage = `
                missing onCatch in api: ${api.name},
                you should set onCatch in api or in props of AIOApis    
            `
            return { errorMessage, success: false, response: false }
        }
        try {
            let finalUrl: string;
            if (api.queryParams) { finalUrl = AddQueryParamsToUrl(api.url, api.queryParams) }
            else { finalUrl = api.url }
            let response = await Axios({ method: api.method, url: finalUrl, data: api.body, headers })
            try { return { success: true, response, errorMessage: '' } }
            catch (err: any) { return { success: false, response, errorMessage: err.message } }
        }
        catch (response: any) {
            try { 
                let errorMessage = handleErrorMessage(response, api)
                errorMessage = errorMessage === false?'':errorMessage
                return { errorMessage, success: false, response } 
            }
            catch (err: any) { return { errorMessage: err.message, success: false, response } }
        }
    }
    private loading = (api: AA_api, state: boolean) => {
        const { loading = true, loader = this.props.loader, name, loadingParent } = api;
        if (loading) {
            const aioLoading = new Loading(loader)
            aioLoading[state ? 'show' : 'hide'](name, loadingParent)
        }
    }
    private handleMock = (api: AA_api) => {
        if (!api.mock) { return }
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
                    }, api.mockDelay || 3000);
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
                    }, api.mockDelay || 3000);
                });
            });
        }
    }
    callCache = async (api: AA_api): Promise<any> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return false }
        this.setToken(api.token || this.props.token)
        this.handleMock(api)
        this.apisThatAreInLoadingTime[api.name] = true;
        let { success, response } = await this.responseToResult(api);
        this.apisThatAreInLoadingTime[api.name] = false
        if (success) { return response }
    };
    requestFn = async <T>(api: AA_api, isRetry?: boolean): Promise<{ errorMessage?: string, success: boolean, response: T }> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return { success: false, response: {} as any, errorMessage: 'request is in loading' } }
        const lasSuccessRes = this.lsc.get(api, 'always')
        if (lasSuccessRes !== null) { return { success: true, response: lasSuccessRes } }
        this.setToken(api.token || this.props.token)
        this.handleMock(api)
        if (api.cache) {
            let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
            if (cachedValue !== undefined) { return { success: true, response: cachedValue } }
        }
        else { this.cache.removeCache(api.name) }
        this.loading(api, true); this.apisThatAreInLoadingTime[api.name] = true;
        if (this.props.onBeforeRequest) {
            const { api: newApi, result } = await this.props.onBeforeRequest(api);
            if (result) { return result }
            if (newApi) { api = newApi }
        }
        let { errorMessage = '', success, response } = await this.responseToResult(api);
        this.loading(api, false); this.apisThatAreInLoadingTime[api.name] = false;
        if (!success) {
            const lasSuccessRes = this.lsc.get(api, 'unsuccess')
            if (lasSuccessRes !== null) { 
                console.log(`api ${api.name} provide last success response`)
                return { success: true, response: lasSuccessRes } 
            }
            let message: string | false = errorMessage;
            if (api.showError === false) { message = false }
            if (typeof message === 'string') {
                this.currentError = message
                if (!isRetry) {
                    let title: string = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
                    if (api.showError !== false) {
                        this.addAlert({ type: 'error', title, text: message });
                    }
                }
            }
        }
        else {
            this.lsc.set(api, response)
            if (api.cache) { this.cache.setCache(api.name, api.cache.name, { api, value: response }) }
        }
        if (this.props.onAfterRequest) {
            const res = await this.props.onAfterRequest(api, { response, success, errorMessage });
            if (res) { return res }
        }

        return { response, success, errorMessage };
    };
    retries = async <T>(api: AA_api, times: number[]): Promise<{ errorMessage?: string, success: boolean, response: T }> => {
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
    request = async <T>(api: AA_api): Promise<{ errorMessage?: string, success: boolean, response: T }> => {
        if (api.retries) { return await this.retries(api, api.retries) }
        else { return await this.requestFn<T>(api) }
    }
}
class LastSuccess {
    private storage: Storage;
    constructor(id: string) {
        this.storage = new Storage(id + '-last-success')
    }
    private isEnable = (api:AA_api)=>!!api.lastSuccess && !!api.lastSuccess.enable
    private getFromStroage = (api: AA_api) => {
        const {expiredIn} = api.lastSuccess || {}
        const value = this.storage.load(api.name, null,expiredIn)
        return value === undefined?null:value
    }
    get = (api:AA_api,type:'always' | 'unsuccess') => {
        const {enable, expiredIn,loadIn = 'unsuccess'} = api.lastSuccess || {}
        if(!this.isEnable(api)) {return null}
        if(type === 'always' && loadIn === 'always'){return this.getFromStroage(api)}
        if(type === 'unsuccess' && loadIn === 'unsuccess'){return this.getFromStroage(api)}
        return null
    }
    set = (api: AA_api, response:any) => {
        if(!this.isEnable(api)) {return}
        if(api.lastSuccess?.saveCondition){
            const {saveCondition} = api.lastSuccess
            const cond = saveCondition({response})
            if(!cond) {return}
        }
        this.storage.save(api.name, response,api.lastSuccess?.expiredIn)
    }
}
export type I_mock = {
    url: string, delay: number,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    result: ((body: any) => { status: number, data: any })
}

type I_callApi = (cachedApi: I_cachedApi<any>) => Promise<any>
class Cache {
    private storage: Storage;
    private callApi: I_callApi;
    constructor(storage: Storage, callApi: I_callApi) {
        this.storage = storage;
        this.callApi = callApi;
    }
    private updateCacheByKey = async (key: string) => {
        if (this.storage.isExpired(key)) { this.storage.remove(key); return; }
        const cachedApi = this.storage.load(key); if (!cachedApi) { return }
        const { api } = cachedApi; if (!api.cache) { return }
        const value = await this.callApi(cachedApi);
        const newCachedApi: I_cachedApi<any> = { api: cachedApi.api, value }
        this.setCache(api.name, api.cache.name as string, newCachedApi)
    }
    getCachedValue = (apiName: string, cacheName: string): any => {
        const key = `${apiName}-${cacheName}`;
        let cachedApi = this.storage.load(key);
        if (cachedApi !== undefined) { return cachedApi.value }
    }
    fetchCachedValue = (apiName: string, cacheName: string) => this.updateCacheByKey(`${apiName}-${cacheName}`)
    setCache = (apiName: string, cacheName: string, cachedApi: I_cachedApi<any>) => {
        const key = `${apiName}-${cacheName}`;
        const expiredIn = cachedApi.api.cache?.expiredIn;
        this.storage.save(key, cachedApi, expiredIn);
    }
    removeCache = (apiName: string, cacheName?: string) => {
        if (cacheName) { this.storage.remove(`${apiName}-${cacheName}`) }
        else {
            const keys = this.storage.getKeys()
            for (let key of keys) {
                if (key.indexOf(`${apiName}-`) === 0) {
                    this.storage.remove(key)
                }
            }
        }
    }
}
export const CreateInstance = <T extends Record<string, any>>(inst: T): T => {

    let res = useRef<any>(null)
    if (res.current === null) { res.current = inst }
    return res.current
}