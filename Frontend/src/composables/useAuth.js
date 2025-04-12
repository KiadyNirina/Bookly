import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(!!localStorage.getItem('token'));

export function useAuth() {
    const { request } = useApi();
    const email = ref('');
    const password = ref('');
    const isPasswordVisible = ref(false);
    const errorMess = ref('');
    const hasError = ref(false);
    const isLoading = ref(false);
    const router = useRouter();

    const login = async () => {
        isLoading.value = true;
        try {
            const response = await request('POST', '/login', {
                email: email.value,
                password: password.value
            });
            localStorage.setItem('token', response.access_token);
            isAuthenticated.value = true;
            router.push('/dashboard');
            console.log('Utilisateur connecté :', response);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                errorMess.value = "Email ou mot de passe incorrect.";
            } else {
                errorMess.value = "Une erreur est survenue. Veuillez réessayer.";
            }
            hasError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        isAuthenticated.value = false;
        router.push('/login');
    };

    const validateWithBackend = async (token) => {
        try {
            const response = await request('POST', '/google-login', { token });
            localStorage.setItem('token', response.token);
            isAuthenticated.value = true;
            router.push('/dashboard');
        } catch (error) {
            console.error("Erreur réseau :", error);
            errorMess.value = "Une erreur réseau est survenue. Veuillez réessayer.";
            hasError.value = true;
        }
    };

    const handleCredentialResponse = (response) => {
        console.log("Token ID reçu :", response.credential);
        validateWithBackend(response.credential);
    };

    const initializeGoogleLogin = () => {
        if (!window.google || !window.google.accounts) {
            console.error("Google Identity Services non chargé !");
            return;
        }
        
        window.google.accounts.id.initialize({
            client_id: "427222673098-tujgvjf5mm6b9djup602111qja0rit86.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            {
                theme: "outline",
                size: "large",
                text: "continue_with",
                shape: "pill",
            }
        );

        window.google.accounts.id.prompt();
    };

    const signup = async (userData) => {
        isLoading.value = true;
        hasError.value = false;
        errorMess.value = "";

        try {
            await request("post", "/register", userData);
        } catch (error) {
            hasError.value = true;
            errorMess.value = error.response?.data?.message || "Une erreur est survenue.";
        } finally {
            isLoading.value = false;
        }
    };

    return {
        email,
        password,
        isPasswordVisible,
        errorMess,
        hasError,
        isLoading,
        login,
        logout,
        isAuthenticated,
        initializeGoogleLogin,
        signup
    };
}
