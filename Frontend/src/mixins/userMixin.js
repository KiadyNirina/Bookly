// src/mixins/userMixin.js
import api from "@/api";

export default {
    data() {
        return {
            user: null,
            users: [],
            currentPage: 1,
            lastPage: 1,
            perPage: 4,
        };
    },
    created() {
        this.fetchUser();
        this.fetchAllUsers();
    },
    methods: {
        async fetchUser() {
            try {
                const userData = await api.getUser();
                this.user = userData.user;
                console.log('Informations utilisateur connecté:', userData);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
            }
        },
        async fetchAllUsers() {
            try {
                const usersData = await api.getUsers(this.currentPage, this.perPage);
                if (this.currentPage === 1) {
                    this.users = usersData.data.data;
                } else {
                    this.users = [...this.users, ...usersData.data.data.data];
                }
                this.lastPage = usersData.data.last_page;
                console.log('Liste des utilisateurs:', usersData.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        }
    },
};
