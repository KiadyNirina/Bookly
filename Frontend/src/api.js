import axios from 'axios';

export default {
    register(data) {
        return axios.post('/register', data);
    },
    login(data) {
        return axios.post('/login', data);
    },
    logout() {
        return axios.post('/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getUser() {
        return axios.get('/user');
    }
};

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});