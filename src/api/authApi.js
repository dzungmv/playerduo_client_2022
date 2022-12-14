import axios from './_baseApi';

import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const authApi = axios(process.env.REACT_APP_API_URL);

authApi.interceptors.request.use(
    function (config) {
        NProgress.start();
        return config;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

authApi.interceptors.response.use(
    function (response) {
        NProgress.done();
        return response;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

export default authApi;
