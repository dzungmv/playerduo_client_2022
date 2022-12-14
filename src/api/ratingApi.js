import axios from './_baseApi';

import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const ratingApi = axios(process.env.REACT_APP_API_URL);

ratingApi.interceptors.request.use(
    function (config) {
        NProgress.start();
        config.headers.Authorization = `Bearer ${localStorage.getItem(
            'accessToken'
        )}`;
        return config;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

ratingApi.interceptors.response.use(
    function (response) {
        NProgress.done();
        return response;
    },
    function (error) {
        NProgress.done();
        return Promise.reject(error);
    }
);

export default ratingApi;
