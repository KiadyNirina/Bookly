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
    }
};
