import axios from 'axios';
import Vue from "vue";
import store from "../store";

let _priceSericeAxios = null;

let _gatewaySericeAxios = null;

let _otaInterfaceAxios = null;

let _spiderSystemAxios = axios.create({
    baseURL: 'http://192.168.2.203:8080',
    headers: {'Content-Type': 'application/json'}
});

_spiderSystemAxios.interceptors.response.use((response) => {
    console.log('AxiosNormal:', response);
    // 存在加密密文的情况,所以此处需要对状态码的是否存在进行判断
    if (!response['code'] && response.data['code'] !== 'ok') {
        Vue.set(store.state, 'error', {
            'type': 'ServerErr',
            'status': response.data['code'],
            'message': response.data['errMsg']
        });
        // eslint-disable-next-line no-undef
        showErrorDialog();
        return Promise.reject('返回的业务状态码不为0!');
    }
    return response.data;
}, err);

function interceptor(response) {
    console.log('AxiosNormal:', response);
    // 返回的为二进制数据的CASE
    if (response.data['code'] === undefined) {
        return response.data;
    }
    if (response.data['code'] !== null) {
        console.log('code', response.data['code'], typeof (response.data['code']));
        if (response.data['code'] * 1 === 4012 || response.data['code'] * 1 === 4011) {
            window.location.href = '/login';
            return;
        }
        if (response.data['code'] * 1 !== 0) {
            Vue.set(store.state, 'error', {
                'type': 'BizErr',
                'status': response.data['code'],
                'message': response.data['message']
            });
            // eslint-disable-next-line no-undef
            showErrorDialog();
            return Promise.reject('返回的业务状态码不为0!');
        }
    }
    return response.data;
}

function err(error) {
    console.log('AxiosError:', error.response);
    if (error.response) {
        Vue.set(store.state, 'error', {
            'type': 'Http',
            'status': error.response.status,
            'message': error.response.statusText
        })
    } else {
        Vue.set(store.state, 'error', {
            'type': 'Network',
            'status': 4,
            'message': '服务器无法访问'
        })
    }
    // eslint-disable-next-line no-undef
    showErrorDialog();
    return Promise.resolve();
}

const connector = {
    axiosAll(allQuery){
        return  axios.all(allQuery)
    },
    priceSericeAxios() {
        if (_priceSericeAxios === null) {
            _priceSericeAxios = axios.create({
                baseURL: Vue.prototype.$globalEnv['priceServiceBaseUrl'],
                headers: {'Content-Type': 'application/json'}
            });
            // _priceSericeAxios.interceptors.request.use(config => {
            //     let yhUserStr = window.localStorage.getItem("yh_user");
            //     console.log('yhUser1:', yhUserStr);
            //     if (yhUserStr) {
            //         let yhUser = JSON.parse(yhUserStr);
            //         config.headers.Authorization = yhUser['token'];
            //     }
            //     return config;
            // }, err);
            _priceSericeAxios.interceptors.response.use(interceptor, err);
        }
        return _priceSericeAxios;
    },
    // gatewaySericeAxios() {
    //     if (_gatewaySericeAxios === null) {
    //         _gatewaySericeAxios = axios.create({
    //             baseURL: Vue.prototype.$globalEnv['gatewayServiceBaseUrl'],
    //             headers: {'Content-Type': 'application/json'}
    //         });
    //         _gatewaySericeAxios.interceptors.response.use(interceptor, err);
    //     }
    //     return _gatewaySericeAxios;
    // },
    otaInterfaceAxios() {
        if (_otaInterfaceAxios === null) {
            _otaInterfaceAxios = axios.create({
                baseURL: Vue.prototype.$globalEnv['otaInterfaceBaseUrl'],
                headers: {'Content-Type': 'application/json'}
            });
            _otaInterfaceAxios.interceptors.response.use((response) => {
                console.log('AxiosNormal:', response);
                // 存在加密密文的情况,所以此处需要对状态码的是否存在进行判断
                if (!response['status'] && response.data['status'] !== 0) {
                    Vue.set(store.state, 'error', {
                        'type': 'ServerErr',
                        'status': response.data['status'],
                        'message': response.data['msg']
                    });
                    // eslint-disable-next-line no-undef
                    showErrorDialog();
                    return Promise.reject('返回的业务状态码不为0!');
                }
                return response.data;
            }, err);
        }
        return _otaInterfaceAxios;
    },
    spiderSystemAxios() {
        return _spiderSystemAxios;
    },
    extractPriceAdminPage(page, resp) {
        page['resultCount'] = resp['data']['total'];
        page['totalPage'] = resp['data']['pages'];
        page['firstPage'] = 1;
        page['lastPage'] = resp['data']['pages'];
        page['previousPage'] = resp['data']['prePage'];
        page['nextPage'] = resp['data']['nextPage'];
    }
}

export default connector;
