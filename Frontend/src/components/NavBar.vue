<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon
  },
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
    <div v-if="!isAuthenticated" class="nav fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[1400px] z-50">
      <div class="nav-left">
        <img src="/logo.jpg" alt="Logo">
      </div>
      <div class="search w-3/5">
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
    <div v-else class="nav fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[1400px] z-50">
      <div class="nav-left">
        <img src="/logo.jpg" alt="Logo">
      </div>
      <div class="nav-img">
        <router-link to="/dashboard" :class="{ 'active-link': isActive('/dashboard') }">
          <Icon :icon="isActive('/dashboard') ? 'lets-icons:home-fill' : 'lets-icons:home'" :class="isActive('/dashboard') ? 'text-[#E67E22]' : ''" height="30"/>
        </router-link>
        <router-link to="/biblio" :class="{ 'active-link': isActive('/biblio') }">
          <Icon :icon="isActive('/biblio') ? 'ic:baseline-library-add' : 'ic:outline-library-add'" :class="isActive('/biblio') ? 'text-[#E67E22]' : ''" height="30"/>
        </router-link>
        <router-link to="/notif" :id="isActive('/notif') ? 'active-link' : ''">
          <Icon :icon="isActive('/notif') ? 'ri:notification-fill' : 'ri:notification-line'" :class="isActive('/notif') ? 'text-[#E67E22]' : ''" height="30"/>
        </router-link>
      </div>
      <div class="search w-2/3">
        <input type="search" placeholder="Rechercher un livre, un auteur, un utilisateur">
      </div>
      <div class="nav-right">
        <router-link to="/profil/create" :class="{ 'active-link': isActive('/profil/saved') || isActive('/profil/create') }">
          <Icon :icon="isActive('/profil/saved') || isActive('/profil/create') ? 'iconamoon:profile-fill' : 'iconamoon:profile-light'" :class="isActive('/profil/saved') || isActive('/profil/create') ? 'text-[#E67E22]' : ''" height="30"/>
        </router-link>
        <router-link to="/settings" :class="{ 'active-link': isActive('/settings') }">
          <Icon :icon="isActive('/settings') ? 'typcn:th-menu' : 'typcn:th-menu-outline'" :class="isActive('/settings') ? 'text-[#E67E22]' : ''" height="30"/>
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
    width: 100%;
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

