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
            <router-link :to="'/books'" :id="isActive('/books') ? 'active-link' : ''">Livres</router-link>
            <router-link :to="'/about'" :id="isActive('/about') ? 'active-link' : ''">À propos</router-link>
            <router-link :to="'/contact'" :id="isActive('/contact') ? 'active-link' : ''">Contact</router-link>
            <router-link :to="'/login'" id="button">Connexion</router-link>
        </div>
    </div>

    <div v-else class="nav">
        <div class="nav-left">
            <img src="../../public/logo.jpg" alt="Logo">
        </div>
        <div class="search">
            <input type="search" name="" id="" placeholder="Rechercher le titre du livre ou le nom de l'écrivain ou le nom de l'utilisateur">
        </div>
        <div class="nav-right">
            <router-link :to="'/dashboard'" :id="isActive('/dashboard') ? 'active-link' : ''">Accueil</router-link>
            <router-link :to="'/books'" :id="isActive('/books') ? 'active-link' : ''">Livres</router-link>
            <router-link :to="'/about'" :id="isActive('/about') ? 'active-link' : ''">Ma Bibliothèque</router-link>
            <router-link :to="'/contact'" :id="isActive('/contact') ? 'active-link' : ''">Notifications</router-link>
            <button id="button">Deconnexion</button>
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
    padding: 5px;
    position: fixed;
    width: 100%;
    z-index: 10;
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
.search{
    width: 60%;
    margin-left: auto;
    margin-right: auto;
}
.search input{
    width: 100%;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.119);
    border-radius: 20px;
    background-color: transparent;
    padding: 10px;
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
</style>
