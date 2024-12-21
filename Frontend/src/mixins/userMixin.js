// src/mixins/userMixin.js
import api from "@/api";

export default {
    data() {
        return {
            user: null,
        };
    },
    created() {
        this.fetchUser();
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
    },
};
