<script>
export default {
    data() {
        return {
            isAuthenticated: false
        };
    },
    created() {
        this.checkAuth();
    },
    methods: {
        isActive(route) {
            return this.$route.path === route;
        },
        checkAuth() {
            this.isAuthenticated = !!localStorage.getItem('token');
        },
        logout() {
            localStorage.removeItem('token');
            this.isAuthenticated = false;
            this.$router.push('/');
        }
    },
    watch: {
        '$route'() {
            this.checkAuth();
        }
    }
};
</script>

<template>
  <main>
    <div v-if="!isAuthenticated" class="nav">
        <div class="nav-left">
            <img src="../../public/logo.jpg" alt="Logo">
        </div>
        <div class="search">
            <input type="search" name="" id="" placeholder="Rechercher le titre du livre ou le nom de l'écrivain ou le nom de l'utilisateur">
        </div>
        <div class="nav-right">
            <router-link :to="'/'" :id="isActive('/') ? 'active-link' : ''">Accueil</router-link>
            <router-link :to="'/books'" :id="isActive('/books') || isActive('/books/popular') ? 'active-link' : ''">Livres</router-link>
            <router-link :to="'/about'" :id="isActive('/about') ? 'active-link' : ''">À propos</router-link>
            <router-link :to="'/contact'" :id="isActive('/contact') ? 'active-link' : ''">Contact</router-link>
            <router-link :to="'/login'" id="button">Connexion</router-link>
        </div>
    </div>

    <div v-else class="nav">
        <div class="nav-left">
            <img src="../../public/logo.jpg" alt="Logo">
        </div>
        <div class="nav-img">
            <router-link :to="'/dashboard'" :id="isActive('/dashboard') ? 'active-link' : ''"><img :src="isActive('/dashboard') ? '/icons/active/accueil.png' : '/icons/accueil.png'" alt=""></router-link>
            <router-link :to="'/biblio'" :id="isActive('/biblio') ? 'active-link' : ''"><img :src="isActive('/biblio') ? '/icons/active/biblio.png' : '/icons/biblio.png'" alt=""></router-link>
            <router-link :to="'/notif'" :id="isActive('/notif') ? 'active-link' : ''"><img src="/icons/notif.png" alt=""></router-link>
        </div>
        <div class="search">
            <input type="search" name="" id="" placeholder="Rechercher le titre du livre ou le nom de l'écrivain ou le nom de l'utilisateur">
        </div>
        <div class="nav-right">
            <router-link :to="'/profil/create'" :id="isActive('/profil/saved') || isActive('/profil/create') ? 'active-link' : ''"><img :src="isActive('/profil/saved') || isActive('/profil/create') ? '/icons/active/user.png' : '/icons/user.png'" alt=""></router-link>
            <router-link :to="'/settings'" :id="isActive('/settings') ? 'active-link' : ''"><img src="/icons/paramètres.png" alt=""></router-link>
            <button id="button" @click="logout">Deconnexion</button>
        </div>
    </div>
    <router-view></router-view>
  </main>
</template>

<style scoped>
.nav{
    display: flex;
    align-items: center;
    background-color: #010310;
    padding: 10px;
    position: fixed;
    width: 100%;
    z-index: 10;
}
.nav img{
    height: 30px;
}
.nav a, .nav button{
    text-decoration: none;
    color: #F5F5DC;
    transition: 0.5s;
}
.nav a:hover, .nav button:hover{
    color: #E67E22;
}
.nav-left{
    width: auto;
}
.nav-left img{
    height: 50px;
    border-radius: 100%;
}
.nav-img{
    width: auto;
    display: flex;
    align-items: center;
}
.nav-img a{
    margin-left: 10px;
    margin-right: 10px;
}
.search{
    width: 70%;
    margin-left: auto;
    margin-right: auto;
}
.search input{
    width: 100%;
    height: auto;
    border: none;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.053);
    padding: 15px;
    color: white;
    transition: 0.3s;
}
.search input:hover{
    background-color: rgba(255, 255, 255, 0.089);
}
.nav-right{
    margin-left: auto;
    width: auto;
    display: flex;
    align-items: center;
}
.nav-right a, .nav-right button{
    margin-left: 10px;
    margin-right: 10px;
}
#button{
    cursor: pointer;
    background-color: #E67E22;
    padding: 10px;
    border-radius: 20px;
    border: 2px solid #E67E22;
    transition: 0.5s;
}
#button:hover{
    background-color: transparent;
    color: #E67E22;
}
#active-link {
  color: #E67E22;
}
*{
    font-family: "poppins";
    font-size: 12px;
}
</style>
