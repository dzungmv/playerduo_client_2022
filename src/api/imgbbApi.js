import axios from './_baseApi';

import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const imgbbApi = axios(process.env.REACT_APP_IMGBB_API);

imgbbApi.interceptors.request.use(
    function (config) {
        NProgress.start();
        config.headers['content-type'] = `multipart/form-data`;
        config.params = {
            key: process.env.REACT_APP_IMGBB_KEY,
        };
        return config;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

imgbbApi.interceptors.response.use(
    function (response) {
        NProgress.done();
        return response;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

export default imgbbApi;
