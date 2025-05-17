<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const {
    email,
    password,
    isPasswordVisible,
    errorMess,
    hasError,
    isLoading,
    login,
    initializeGoogleLogin
} = useAuth();

onMounted(initializeGoogleLogin);
</script>

<template>
    <div class="content-login h-screen flex items-center justify-center">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div :class="['sect2', { 'error-border': hasError }]">
                <h1>Se connecter</h1>
                <p v-if="errorMess" id="error">{{ errorMess }}</p>
                <form @submit.prevent="login">
                    <label id="label">Email :</label>
                    <input type="text" v-model="email" placeholder="Entrer votre email" />

                    <label id="label">Mot de passe :</label>
                    <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password"
                        placeholder="Entrez votre mot de passe" />
                    <label>
                        <input class="mr-1" type="checkbox" v-model="isPasswordVisible" />
                        Afficher le mot de passe
                    </label>
                    <a href="#" id="passwordForgot">Mot de passe oublié?</a>
                    <button v-if="isLoading" disabled>Chargement...</button>
                    <button v-else>Se connecter</button>
                </form>
                <p class="mt-2 mb-2">Ou</p>
                <div class="other">
                    <div id="google-signin-button"></div>
                </div>
                <p class="mb-3" id="foot">Vous n'êtes pas encore inscrit? <router-link class="hover:text-blue-500" to="/signup">S'inscrire</router-link></p>
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
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    font-family: "Poppins";
    font-size: 12px;
}
.content-login .form-login{
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.102);
    height: auto;
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
    width: 50%;
    box-sizing: border-box;
}
.content-login .form-login .sect2 h1 {
    color: white;
    font-family: 'MaPolice';
    font-weight: 100;    
    text-align: center;
    font-size: 40px;
    margin-bottom: 15px;
    margin-top: 10px;
}
.content-login .form-login .sect2 form {
    width: 80%;
}
.content-login .form-login .sect2 form input[type='text'], .content-login .form-login .sect2 form input[type='password']{
    width: 100%;
    margin-bottom: 5px;
    height: 40px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.183);
    border-radius: 10px;
    color: white;
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
    width: 90%; 
}
#passwordForgot{
    text-decoration: none;
    color: #4388ff;
    display: flex;
    justify-content: right;
    margin-bottom: 10px;
}
#foot{
    margin-top: 20px;
}
</style>