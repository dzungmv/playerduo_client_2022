import axios from './_baseApi';

const followApi = axios(process.env.REACT_APP_API_URL);

followApi.interceptors.request.use(
    function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
            'accessToken'
        )}`;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

followApi.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default followApi;
