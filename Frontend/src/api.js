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
        const token = localStorage.getItem('token');
        if (token) {
            return axios.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => response.data)
            .catch(error => {
                console.error('Erreur lors de la récupération des infos utilisateur:', error);
                throw error;
            });
        } else {
            return Promise.reject('Token non trouvé');
        }
    },
    bookCreate(data) {
        return axios.post('/createBook', data);
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