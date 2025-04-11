<script>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

export default {
    setup() {
        const name = ref("");
        const email = ref("");
        const password = ref("");
        const confirmPassword = ref("");
        const router = useRouter();
        const { signup, errorMess, isLoading, hasError } = useAuth();

        const handleSignup = async () => {
            if (password.value !== confirmPassword.value) {
                errorMess.value = "Les mots de passe ne correspondent pas.";
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
                router.push("/welcome");
            }
        };

        return { name, email, password, confirmPassword, handleSignup, errorMess, isLoading, hasError };
    }
};
</script>

<template>
    <div class="content-login">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div :class="['sect2', { 'error-border': hasError }]">
                <h1>S'inscrire</h1>
                <p id="error" v-if="errorMess">{{ errorMess }}</p>
                <form @submit.prevent="handleSignup">
                    <label id="label">Nom :</label>
                    <input type="text" v-model="name" placeholder="Entrer votre nom d'utilisateur">

                    <label id="label">Email :</label>
                    <input type="text" v-model="email" placeholder="Entrer votre email">

                    <label id="label">Mot de passe :</label>
                    <div class="double">
                        <input type="password" class="password" v-model="password" placeholder="Entrez votre mot de passe">
                        <input type="password" class="password" v-model="confirmPassword" placeholder="Confirmer votre mot de passe">
                    </div><br>

                    <button v-if="isLoading" disabled>Loading...</button>
                    <button v-else>S'inscrire</button>
                </form>
                <p id="foot">Vous êtes déjà membre? <router-link to="/login">Se connecter</router-link></p>
            </div>
        </div>
    </div>
</template>

<style>
#label {
    margin: 10px 0 0 0;
}
.double{
    display: flex;
}
.double input{
    margin: 1px;
}
</style>