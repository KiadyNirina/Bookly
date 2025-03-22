import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Crée une instance Axios avec la base URL définie
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Intercepteur pour ajouter le jeton d'authentification à chaque requête
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    /**
     * Inscription d'un utilisateur
     * @param {Object} data - Données utilisateur
     * @returns {Promise}
     */
    register(data) {
        return apiClient.post('/register', data);
    },

    /**
     * Connexion d'un utilisateur
     * @param {Object} data - Données de connexion
     * @returns {Promise}
     */
    login(data) {
        return apiClient.post('/login', data);
    },

    /**
     * Déconnexion d'un utilisateur
     * @returns {Promise}
     */
    logout() {
        return apiClient.post('/logout');
    },

    /**
     * Récupération des informations de l'utilisateur connecté
     * @returns {Promise}
     */
    getUser() {
        return apiClient.get('/user')
            .then(response => response.data)
            .catch(error => {
                console.error('Erreur lors de la récupération des infos utilisateur:', error);
                throw error;
            });
    },

    /**
     * Récupération des utilisateurs
     * @returns {Promise}
     */
    getUsers(page, perPage) {
        return apiClient.get('/users', {
            params: {page, per_page: perPage}
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        });
    },

    getOneUser(id) {
        return apiClient.get(`/users/${id}`);
    }, 

    /**
     * Création d'un livre
     * @param {Object} data - Données du livre
     * @returns {Promise}
     */
    bookCreate(data) {
        return apiClient.post('/createBook', data);
    },

    /**
     * Récupération des livres de l'utilisateur connecté
     * @param {Number} page - Numéro de la page
     * @param {Number} perPage - Nombre d'éléments par page
     * @returns {Promise}
     */
    getUserBook(page, perPage) {
        return apiClient.get('/user/books', {
            params: { page, per_page: perPage },
        });
    },

    /**
     * Récupération des livres d un utilisateur
     * @param {Number} id - Id de l'utilisateur
     * @param {Number} page - Numéro de la page
     * @param {Number} perPage - Nombre d'éléments par page
     * @returns {Promise}
     */
    getUserSelectedBooks(id, page, perPage) {
        return apiClient.get(`/user/${id}/books`, {
            params: { id, page, per_page: perPage },
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Erreur lors de la récupération des livres utilisateur séléctionné:', error);
            throw error;
        });
    },

    /**
     * Récupération des livres récents
     * @param {Number} page - Numéro de la page
     * @param {Number} perPage - Nombre d'éléments par page
     * @returns {Promise}
     */
    getRecentBooks(page, perPage) {
        return apiClient.get('/books/recent', {
            params: { page, per_page: perPage },
        });
    },

    /**
     * Validation du token Google avec le backend
     * @param {String} token - Token Google
     * @returns {Promise}
     */
    validateGoogleToken(token) {
        return apiClient.post('/google-login', { token });
    },

    /**
     * Vérification de suivi d'un utilisateur
     * @param {Number} id - Id de l'utilisateur
     * @returns {Promise}
     */
    checkFollow(id) {
        return apiClient.get(`/users/${id}/is-following`);
    },

    /**
     * Suivre un utilisateur
     * @param {Number} id - Id de l'utilisateur
     * @returns {Promise}
     */
    followUser(id) {
        return apiClient.post(`/users/${id}/follow`);
    },

    /**
     * Désabonner un utilisateur
     * @param {Number} id - Id de l'utilisateur
     * @returns {Promise}
     */
    unfollowUser(id) {
        return apiClient.post(`/users/${id}/unfollow`);
    }
};