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
    <div class="content-login h-screen flex items-center justify-center">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div :class="['sect2', { 'error-border': hasError }]">
                <h1>S'inscrire</h1>
                <p id="error" v-if="errorMess">{{ errorMess }}</p>
                <p id="success" class="text-green-500" v-if="successMessage">{{ successMessage }}</p>
                <form @submit.prevent="handleSignup">
                    <label id="label">Nom :</label>
                    <input type="text" v-model="name" placeholder="Entrer votre nom d'utilisateur">

                    <label id="label">Email :</label>
                    <input type="text" v-model="email" placeholder="Entrer votre email">

                    <label id="label">Mot de passe :</label>
                    <div class="">
                        <input :type="isPasswordVisible ? 'text' : 'password'" class="" v-model="password" placeholder="Entrez votre mot de passe">
                        <input :type="isPasswordVisible ? 'text' : 'password'" class="" v-model="confirmPassword" placeholder="Confirmer votre mot de passe">
                    </div>

                    <label>
                        <input class="mr-1" type="checkbox" v-model="isPasswordVisible" />
                        Afficher le mot de passe
                    </label>

                    <button class="mt-2" v-if="isLoading" disabled>Loading...</button>
                    <button class="mt-2" v-else>S'inscrire</button>
                </form>

                <p class="mt-2 mb-2">Ou</p>
                <div class="other">
                    <div id="google-signin-button"></div>
                </div>

                <p class="mb-3" id="foot">Vous êtes déjà membre? <router-link class="hover:text-blue-500" to="/login">Se connecter</router-link></p>
            </div>
        </div>
    </div>
</template>

<style>
#label {
    margin: 5px 0 0 0;
}
#google-signin-button {
    width: 90%; 
}
</style>