import axios from 'axios';

const baseAPI = (url) => {
    const api = axios.create({
        baseURL: url,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        function (config) {
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    return api;
};

export default baseAPI;
