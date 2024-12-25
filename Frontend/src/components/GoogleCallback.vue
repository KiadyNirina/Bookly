<template>
    <div>
        <p>Connexion en cours...</p>
    </div>
</template>

<script>
import api from '@/api';

export default {
    async created() {
        const googleCallbackUrl = window.location.href;
        try {
            const { access_token, user } = await api.fetchAccessToken(googleCallbackUrl);

            // Sauvegarder le token dans localStorage ou Vuex
            localStorage.setItem('access_token', access_token);

            // Redirection après connexion
            this.$router.push({ name: 'Dashboard' });
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    },
};
</script>
