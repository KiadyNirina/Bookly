<script>
import api from '@/api';

export default {
    data() {
        return {
            email: '',
            password: '',
            isPasswordVisible: false,
            errorMess: '',
            hasError: false,
            isLoading: false,
        };
    },
    name: "GoogleLogin",
    mounted() {
        this.initializeGoogleLogin();
    },
    methods: {
        async login() {
            this.isLoading = true;
            try {
                const response = await api.login({
                    email: this.email,
                    password: this.password
                });
                localStorage.setItem('token', response.data.access_token);
                this.$router.push('/dashboard');
                console.log('l info de l utilisateur connecté :', response)
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    this.errorMess = "Email ou mot de passe incorrect.";
                } else {
                    this.errorMess = "Une erreur est survenue. Veuillez réessayer.";
                }
                this.hasError = true;
            } finally {
                this.isLoading = false;
            }
        },

        async validateWithBackend(token) {
            try {
                const response = await api.validateGoogleToken(token);
                const data = response.data;
                console.log("Réponse du backend :", data);
                localStorage.setItem("token", data.token);
                this.$router.push('/dashboard');
            } catch (error) {
                console.error("Erreur réseau :", error);
                this.errorMess = "Une erreur réseau est survenue. Veuillez réessayer.";
                this.hasError = true;
            }
        },

        handleCredentialResponse(response) {
            console.log("Token ID reçu :", response.credential);
            // Envoyer le token au backend pour validation
            this.validateWithBackend(response.credential);
        },

        initializeGoogleLogin() {
            // Initialiser Google Identity Services
            window.google.accounts.id.initialize({
                client_id: "427222673098-tujgvjf5mm6b9djup602111qja0rit86.apps.googleusercontent.com",
                callback: this.handleCredentialResponse,
            });

            // Rendre le bouton Google
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
        }
    }
};
</script>

<template>
    <div class="content-login">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div :class="['sect2', {'error-border': hasError}]">
                <h1>Se connecter</h1>
                <p v-if="errorMess" id="error">{{ errorMess }}</p>
                <form @submit.prevent="login" action="">
                    <input 
                        type="text" 
                        v-model="email" 
                        placeholder="Entrer votre email">
                    <input name=""
                        :type="isPasswordVisible ? 'text' : 'password'"
                        id="password"
                        v-model="password"
                        placeholder="Entrez votre mot de passe">
                    <label>
                        <input
                            type="checkbox"
                            v-model="isPasswordVisible"
                        />
                        Afficher le mot de passe
                    </label>
                    <a href="" id="passwordForgot">Mot de passe oublié?</a>
                    <button v-if="isLoading" disabled>loading...</button>
                    <button v-else>Se connecter</button>
                </form>
                <p>Ou :</p>
                <div class="other">
                    <div id="google-signin-button"></div>
                </div>
                <p id="foot">Vous n'êtes pas encore inscrit? <router-link to="/signup">S'inscrire</router-link></p>
            </div>
        </div>
    </div>
</template>

<style>
@font-face {
    font-family: 'MaPolice';
    src: url('../../public/font/RubikWetPaint-Regular.ttf') format('truetype');
}
.content-login{
    padding: 100px;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
}
.content-login .form-login{
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.102);
    height: 80vh;
    border-radius: 20px;
}
.content-login .form-login img{
    width: 50%;
    object-fit: cover;
    border-radius: 20px 0px 0px 20px;
}
.content-login .form-login .sect2{
    display: flex; 
    flex-direction: column; /* Empile les éléments verticalement */
    justify-content: center; /* Centre verticalement */
    align-items: center; /* Centre horizontalement */
    padding: 10px;
    width: 50%;
    box-sizing: border-box;
}
.content-login .form-login .sect2 h1 {
    color: white;
    font-family: 'MaPolice';
    font-weight: 100;    
    text-align: center;
    font-size: 40px;
    margin-bottom: 50px;
}
.content-login .form-login .sect2 form {
    width: 90%;
}
.content-login .form-login .sect2 form input[type='text'], .content-login .form-login .sect2 form input[type='password']{
    width: 100%;
    margin-bottom: 10px;
    height: 40px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.183);
    border-radius: 10px;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    padding: 0;
    text-align: center;
}
.content-login .form-login .sect2 form label {
    display: flex;
    margin: 0;
    width: auto;
    color: rgba(255, 255, 255, 0.659);
    align-items: center;
    margin-bottom: 20px;
    font-size: 12px;
}
.content-login .form-login .sect2 form input[type='checkbox']{
    cursor: pointer;
    padding: 20px;
}
.content-login .form-login .sect2 form input[type='checkbox']:hover{
    cursor: pointer;
}
.content-login .form-login .sect2 form input[type='checkbox']:checked{
    color: #E67E22;
}
.content-login .form-login .error-border form input[type='text'], .content-login .form-login .error-border form input[type='password']{
    border: 1px solid rgb(255, 62, 62);
}
#error{
    color: rgb(255, 62, 62);
    font-size: 12px;
}
.content-login .form-login .sect2 form button{
    width: 100%;
    height: 40px;
    background-color: #E67E22;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: bold;
    transition: 0.5s;
    border: 1px solid #E67E22;
}
.content-login .form-login .sect2 form button:hover{
    background-color: transparent;
    color: #E67E22;
    cursor: pointer;
}
.content-login .form-login .sect2 form button:disabled {
    cursor: not-allowed;
}
.content-login .form-login .sect2 p{
    color: rgba(255, 255, 255, 0.659);
    text-align: center;
}
.content-login .form-login .sect2 .other{
    display: flex;
    width: 90%;
    justify-content: center;
}
#google-signin-button {
    width: 100%; 
}
#passwordForgot{
    text-decoration: none;
    color: #4388ff;
    display: flex;
    justify-content: right;
    margin-bottom: 10px;
}
</style>