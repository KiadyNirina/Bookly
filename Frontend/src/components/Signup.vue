<script>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default {
    setup() {
        const name = ref("");
        const email = ref("");
        const password = ref("");
        const confirmPassword = ref("");
        const router = useRouter();
        const successMessage = ref("");
        const { signup, isPasswordVisible, errorMess, isLoading, hasError, initializeGoogleLogin } = useAuth();

        const handleSignup = async () => {
            if (password.value !== confirmPassword.value) {
                errorMess.value = "Les mots de passe ne correspondent pas.";
                hasError.value = true;
                return;
            }

            if (name.value === "" || email.value === "" || password.value === "") {
                errorMess.value = "Tous les champs sont obligatoires.";
                hasError.value = true;
                return;
            }

            if (email.value !== "" && !email.value.includes("@")) {
                errorMess.value = "Veuillez entrer une adresse e-mail valide.";
                hasError.value = true;
                return;
            }

            await signup({
                name: name.value,
                email: email.value,
                password: password.value,
                password_confirmation: confirmPassword.value
            });

            if (!hasError.value) {
                successMessage.value = "Inscription réussie! Vous pouvez maintenant vous connecter.";
                errorMess.value = "";
                hasError.value = false;
            }
        };

        onMounted(() => {
            initializeGoogleLogin();
        });

        return { name, email, password, confirmPassword, isPasswordVisible, handleSignup, errorMess, successMessage, isLoading, hasError };
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div class="w-full max-w-5xl bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <!-- Image section - hidden on mobile -->
            <div class="hidden md:block md:w-1/2 relative">
                <img src="../../public/giphy_book (4).gif" alt="Animated book" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div class="absolute bottom-6 left-6 text-white">
                    <h2 class="text-2xl font-bold">Rejoignez Bookly</h2>
                    <p class="text-purple-200 mt-2">Découvrez une communauté de lecteurs passionnés</p>
                </div>
            </div>
            
            <!-- Form section -->
            <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <div class="text-center mb-6">
                    <h1 class="text-3xl md:text-4xl font-bold bg-clip-text text-[#E67E22] font-rubik">
                        S'inscrire
                    </h1>
                    <p class="text-gray-400 mt-2">Créez votre compte Bookly</p>
                </div>

                <div v-if="errorMess" class="mb-4 p-3 bg-red-900 bg-opacity-40 border border-red-500 rounded-lg text-red-200 text-sm">
                    {{ errorMess }}
                </div>

                <div v-if="successMessage" class="mb-4 p-3 bg-green-900 bg-opacity-40 border border-green-500 rounded-lg text-green-200 text-sm">
                    {{ successMessage }}
                </div>

                <form @submit.prevent="handleSignup" class="space-y-4">
                    <div>
                        <label for="name" class="block font-medium text-gray-300 mb-1">Nom d'utilisateur</label>
                        <input 
                            id="name"
                            type="text" 
                            v-model="name" 
                            placeholder="Entrer votre nom d'utilisateur"
                            :class="{'border-red-500': hasError && name === ''}"
                            class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition duration-200" 
                        />
                    </div>

                    <div>
                        <label for="email" class="block font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            id="email"
                            type="text" 
                            v-model="email" 
                            placeholder="Entrer votre email"
                            :class="{'border-red-500': hasError && (email === '' || !email.includes('@'))}"
                            class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition duration-200" 
                        />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="password" class="block font-medium text-gray-300 mb-1">Mot de passe</label>
                            <input 
                                id="password"
                                :type="isPasswordVisible ? 'text' : 'password'" 
                                v-model="password" 
                                placeholder="Entrez votre mot de passe"
                                :class="{'border-red-500': hasError && password === ''}"
                                class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition duration-200" 
                            />
                        </div>
                        
                        <div>
                            <label for="confirmPassword" class="block font-medium text-gray-300 mb-1">Confirmation</label>
                            <input 
                                id="confirmPassword"
                                :type="isPasswordVisible ? 'text' : 'password'" 
                                v-model="confirmPassword" 
                                placeholder="Confirmer votre mot de passe"
                                :class="{'border-red-500': hasError && password !== confirmPassword}"
                                class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition duration-200" 
                            />
                        </div>
                    </div>

                    <div class="flex items-center">
                        <label class="flex items-center text-gray-400">
                            <input 
                                type="checkbox" 
                                v-model="isPasswordVisible" 
                                class="h-4 w-4 text-[#E67E22] focus:ring-[#E67E22] border-gray-600 rounded bg-gray-700" 
                            />
                            <span class="ml-2">Afficher les mots de passe</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full py-3 px-4 bg-[#E67E22] text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span v-if="isLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Chargement...
                        </span>
                        <span v-else>S'inscrire</span>
                    </button>
                </form>

                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-gray-900 text-gray-400">Ou</span>
                    </div>
                </div>

                <div class="other flex justify-center">
                    <div id="google-signin-button" class="w-full max-w-xs"></div>
                </div>

                <p class="text-center text-gray-400 mt-6 text-sm">
                    Vous êtes déjà membre? 
                    <router-link to="/login" class="text-[#E67E22] hover:text-orange-300 font-medium ml-1 transition duration-150">
                        Se connecter
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<style>
@font-face {
    font-family: 'RubikWetPaint';
    src: url('../../public/font/RubikWetPaint-Regular.ttf') format('truetype');
}

.font-rubik {
    font-family: 'RubikWetPaint', sans-serif;
}

#google-signin-button {
    display: flex;
    justify-content: center;
}

.form-login {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 340px) {
    .content-login {
        padding: 10px;
    }
}
</style>