import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem('token');

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        console.log(
            'API REQUEST:',
            config.method?.toUpperCase(),
            config.url
        );

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => {

        console.log(
            'API RESPONSE:',
            response.status,
            response.config.url
        );

        return response;
    },

    (error) => {

        console.error(
            'API ERROR:',
            error.config?.method?.toUpperCase(),
            error.config?.url,
            error.response?.status,
            error.response?.data
        );


        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (
            error.response &&
            error.response.status === 401
        ) {

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = '/login';
        }


        return Promise.reject(error);
    }
);


export default api;