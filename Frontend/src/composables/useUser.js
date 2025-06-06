import { ref, computed, watchEffect } from 'vue';
import { useApi } from '@/composables/useApi';

const user = ref(null);
const userOne = ref(null);
const hasUserError = ref(false);

export function useUser() {
    const { request } = useApi();

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            user.value = null;
            return;
        }

        hasUserError.value = false;

        try {
            const response = await request('GET', '/user');
            user.value = response.user;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            user.value = null;
            hasUserError.value = true;
        }
    };

    const fetchOneUser = async (userId) => {
        hasUserError.value = false;

        try {
            const response = await request('GET', `/users/${userId}`);
            userOne.value = response.data;
            console.log("Utilisateur récupéré :", userOne.value);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            userOne.value = null;
            hasUserError.value = true;
        }
    };

    const isLoggedIn = computed(() => !!user.value);

    // Pour automatiquement chercher l'utilisateur si un token est présent
    watchEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user.value) {
            fetchUser();
        }
    });

    return {
        user,
        userOne,
        isLoggedIn,
        hasUserError,
        fetchUser,
        fetchOneUser
    };
}
