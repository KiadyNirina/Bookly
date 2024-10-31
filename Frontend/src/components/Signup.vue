<script>
export default {
  data() {
    return {
      password: '',
      isPasswordVisible: false,
    };
  },
};
</script>

<template>
    <div class="content-login">
        <div class="form-login">
            <img src="../../public/giphy_book (4).gif" alt="">
            <div class="sect2">
                <h1>S'inscrire</h1>
                <form action="">
                    <input type="text" placeholder="Entrer votre nom d'utilisateur">
                    <input type="text" placeholder="Entrer votre email">
                    <div class="double">
                        <input name=""
                        type='password'
                        id="password"
                        placeholder="Entrez votre mot de passe">
                        <input name=""
                        type='password'
                        id="password"
                        placeholder="Confirmer votre mot de passe">
                    </div>
                    
                    <button>S'inscrire</button>
                </form>
                <p id="foot">Vous êtes déjà membre? <router-link to="/login">Se connecter</router-link></p>
            </div>
        </div>
    </div>
</template>

<style>
.double{
    display: flex;
}
.double input{
    margin: 1px;
}
</style>