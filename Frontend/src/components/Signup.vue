<script>
import api from '@/api';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: '',
            hasError: false,
            isLoading: false
        };
    },
    methods: {
        async signup() {
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Les mots de passe ne correspondent pas.";
                this.hasError = true;
                return;
            }

            this.isLoading = true;

            try {
                const response = await api.register({
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.confirmPassword
                });
                this.$router.push('/welcome'); 
                this.hasError = false;
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = "Une erreur est survenue lors de l'inscription.";
                this.hasError = true;
            } finally {
                this.isLoading = false; 
            }
        }
    }
};
</script>

<template>
    <div class="content-login">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div :class="['sect2', {'error-border' : hasError}]">
                <h1>S'inscrire</h1>
                <p id="error" v-if="errorMessage">{{ errorMessage }}</p>
                <form  @submit.prevent="signup" action="">
                    <label id="label" for="">Nom :</label>
                    <input 
                        type="text" 
                        v-model="name"
                        placeholder="Entrer votre nom d'utilisateur">

                    <label id="label" for="">Email :</label>
                    <input 
                        type="text" 
                        v-model="email"
                        placeholder="Entrer votre email">

                    <label id="label" for="">Mot de passe :</label>
                    <div class="double">
                        <input name=""
                            type='password'
                            class="password"
                            v-model="password"
                            placeholder="Entrez votre mot de passe">
                        
                        <input name=""
                            type='password'
                            v-model="confirmPassword"
                            class="password"
                            placeholder="Confirmer votre mot de passe">
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
    font-size: 12px;
}
.double{
    display: flex;
}
.double input{
    margin: 1px;
}
</style>