<script>
import api from '@/api';

export default {
    data() {
        return {
            email: '',
            password: '',
            isPasswordVisible: false,
        };
    },
    methods: {
        async login() {
            try {
                const response = await api.login({
                    email: this.email,
                    password: this.password
                });
                localStorage.setItem('token', response.data.access_token);
                this.$router.push('/dashboard');
            } catch (error) {
                console.error(error);
                alert('Login failed');
            }
        }
    }
};
</script>

<template>
    <div class="content-login">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div class="sect2">
                <h1>Se connecter</h1>
                <form action="">
                    <input type="text" placeholder="Entrer votre email">
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
                    <button>Se connecter</button>
                </form>
                <p>Ou :</p>
                <div class="other">
                    <button><img src="../../public/google.png" alt=""> Se connecter avec Google</button>
                    <button><img src="../../public/mail.png" alt=""> Se connecter avec Email</button>
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
    height: 500px;
    border-radius: 20px;
}
.content-login .form-login img{
    width: 50%;
    object-fit: cover;
    border-radius: 20px 0px 0px 20px;
}
.content-login .form-login .sect2{
    padding: 20px;
    width: 50%;
}
.content-login .form-login .sect2 h1 {
    color: white;
    font-family: 'MaPolice';
    font-weight: 100;    
    text-align: center;
}
.content-login .form-login .sect2 form input[type='text'], .content-login .form-login .sect2 form input[type='password']{
    width: 100%;
    margin-bottom: 5px;
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
    font-size: 13px;
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
.content-login .form-login .sect2 p{
    color: rgba(255, 255, 255, 0.659);
    text-align: center;
}
.content-login .form-login .sect2 .other{
    display: flex;
}
.content-login .form-login .sect2 .other button{
    width: 100%;
    height: 40px;
    background-color: #0048ff;
    color: white;
    border: 1px solid #0048ff;
    border-radius: 10px;
    font-size: 13px;
    transition: 0.5s;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.content-login .form-login .sect2 .other button:hover{
    cursor: pointer;
    border: 1px solid white;
    background-color: transparent;
}
.content-login .form-login .sect2 .other button img{
    height: 30px;
    width: auto;
    margin-right: 2px;
}
#foot{
    position: relative;
    top: 60px;
}
#passwordForgot{
    text-decoration: none;
    color: #4388ff;
    display: flex;
    justify-content: right;
    margin-bottom: 10px;
}
</style>