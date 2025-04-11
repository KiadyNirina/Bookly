<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    return { isAuthenticated, logout, isActive };
  }
};
</script>

<template>
  <main>
    <!-- Navbar si l'utilisateur n'est pas authentifié -->
    <div v-if="!isAuthenticated" class="nav">
      <div class="nav-left">
        <img src="/logo.jpg" alt="Logo">
      </div>
      <div class="search">
        <input type="search" placeholder="Rechercher un livre, un auteur, un utilisateur">
      </div>
      <div class="nav-right">
        <router-link to="/" :class="{ 'active-link': isActive('/') }">Accueil</router-link>
        <router-link to="/books" :class="{ 'active-link': isActive('/books') || isActive('/books/popular') || isActive('/books/recent') || isActive('/books/posted') }">Livres</router-link>
        <router-link to="/about" :class="{ 'active-link': isActive('/about') }">À propos</router-link>
        <router-link to="/contact" :class="{ 'active-link': isActive('/contact') }">Contact</router-link>
        <router-link to="/login" id="button">Connexion</router-link>
      </div>
    </div>

    <!-- Navbar si l'utilisateur est authentifié -->
    <div v-else class="nav">
      <div class="nav-left">
        <img src="/logo.jpg" alt="Logo">
      </div>
      <div class="nav-img">
        <router-link to="/dashboard" :class="{ 'active-link': isActive('/dashboard') }">
          <img :src="isActive('/dashboard') ? '/icons/active/accueil.png' : '/icons/accueil.png'" alt="">
        </router-link>
        <router-link to="/biblio" :class="{ 'active-link': isActive('/biblio') }">
          <img :src="isActive('/biblio') ? '/icons/active/biblio.png' : '/icons/biblio.png'" alt="">
        </router-link>
        <router-link to="/notif" :id="isActive('/notif') ? 'active-link' : ''">
            <img :src="isActive('/notif') ? '/icons/active/notif.png' : '/icons/notif.png'" alt="">
        </router-link>
      </div>
      <div class="search">
        <input type="search" placeholder="Rechercher un livre, un auteur, un utilisateur">
      </div>
      <div class="nav-right">
        <router-link to="/profil/create" :class="{ 'active-link': isActive('/profil/saved') || isActive('/profil/create') }">
          <img :src="isActive('/profil/saved') || isActive('/profil/create') ? '/icons/active/user.png' : '/icons/user.png'" alt="">
        </router-link>
        <router-link to="/settings" :class="{ 'active-link': isActive('/settings') }">
          <img :src="isActive('/settings') ? '/icons/active/paramètres.png' : '/icons/paramètres.png'" src="/icons/paramètres.png" alt="">
        </router-link>
        <button id="button" @click="logout">Déconnexion</button>
      </div>
    </div>
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
}
</style>

