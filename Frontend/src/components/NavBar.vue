<script>
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { Icon } from '@iconify/vue';
import { useSearch } from '@/composables/useSearch';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  components: {
    Icon
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { searchQuery } = useSearch();
    const isMobileMenuOpen = ref(false);
    const isMobile = ref(window.innerWidth < 1024);

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    const handleResize = () => {
      isMobile.value = window.innerWidth < 1024;
      if (!isMobile.value) {
        closeMobileMenu();
      }
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return { 
      isAuthenticated, 
      logout, 
      isActive, 
      searchQuery, 
      isMobileMenuOpen, 
      toggleMobileMenu, 
      closeMobileMenu,
      isMobile
    };
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
      <div class="search relative w-3/5">
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Rechercher un livre, un auteur, un utilisateur"
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="nav-right">
        <router-link to="/" :class="{ 'active-link': isActive('/') }">Accueil</router-link>
        <router-link to="/books" :class="{ 'active-link': isActive('/books') || isActive('/books/popular') || isActive('/books/recent') || isActive('/books/posted') }">Livres</router-link>
        <router-link to="/about" :class="{ 'active-link': isActive('/about') }">À propos</router-link>
        <router-link to="/contact" :class="{ 'active-link': isActive('/contact') }">Contact</router-link>
        <router-link to="/login" id="button">Connexion</router-link>
      </div>
      
      <!-- Bouton menu burger pour mobile -->
      <button class="mobile-menu-toggle lg:hidden" @click="toggleMobileMenu">
        <Icon :icon="isMobileMenuOpen ? 'ep:close' : 'ci:hamburger-md'" height="30" />
      </button>
      
      <!-- Menu mobile -->
      <div v-if="isMobile" class="mobile-menu-container" :class="{ 'open': isMobileMenuOpen }">
        <div class="mobile-menu-backdrop" @click="closeMobileMenu"></div>
        <div class="mobile-menu">
          <router-link to="/" :class="{ 'active-link': isActive('/') }" @click="closeMobileMenu">Accueil</router-link>
          <router-link to="/books" :class="{ 'active-link': isActive('/books') || isActive('/books/popular') || isActive('/books/recent') || isActive('/books/posted') }" @click="closeMobileMenu">Livres</router-link>
          <router-link to="/about" :class="{ 'active-link': isActive('/about') }" @click="closeMobileMenu">À propos</router-link>
          <router-link to="/contact" :class="{ 'active-link': isActive('/contact') }" @click="closeMobileMenu">Contact</router-link>
          <router-link to="/login" id="button-mobile" @click="closeMobileMenu">Connexion</router-link>
        </div>
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
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Rechercher un livre, un auteur, un utilisateur"
        />
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
      
      <!-- Bouton menu burger pour mobile -->
      <button class="mobile-menu-toggle lg:hidden" @click="toggleMobileMenu">
        <Icon :icon="isMobileMenuOpen ? 'ep:close' : 'ci:hamburger-md'" height="30" />
      </button>
      
      <!-- Menu mobile -->
      <div v-if="isMobile" class="mobile-menu-container" :class="{ 'open': isMobileMenuOpen }">
        <div class="mobile-menu-backdrop" @click="closeMobileMenu"></div>
        <div class="mobile-menu">
          <router-link to="/dashboard" :class="{ 'active-link': isActive('/dashboard') }" @click="closeMobileMenu">
            <Icon :icon="isActive('/dashboard') ? 'lets-icons:home-fill' : 'lets-icons:home'" :class="isActive('/dashboard') ? 'text-[#E67E22]' : ''" height="30"/>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/biblio" :class="{ 'active-link': isActive('/biblio') }" @click="closeMobileMenu">
            <Icon :icon="isActive('/biblio') ? 'ic:baseline-library-add' : 'ic:outline-library-add'" :class="isActive('/biblio') ? 'text-[#E67E22]' : ''" height="30"/>
            <span>Bibliothèque</span>
          </router-link>
          <router-link to="/notif" :id="isActive('/notif') ? 'active-link' : ''" @click="closeMobileMenu">
            <Icon :icon="isActive('/notif') ? 'ri:notification-fill' : 'ri:notification-line'" :class="isActive('/notif') ? 'text-[#E67E22]' : ''" height="30"/>
            <span>Notifications</span>
          </router-link>
          <router-link to="/profil/create" :class="{ 'active-link': isActive('/profil/saved') || isActive('/profil/create') }" @click="closeMobileMenu">
            <Icon :icon="isActive('/profil/saved') || isActive('/profil/create') ? 'iconamoon:profile-fill' : 'iconamoon:profile-light'" :class="isActive('/profil/saved') || isActive('/profil/create') ? 'text-[#E67E22]' : ''" height="30"/>
            <span>Profil</span>
          </router-link>
          <router-link to="/settings" :class="{ 'active-link': isActive('/settings') }" @click="closeMobileMenu">
            <Icon :icon="isActive('/settings') ? 'typcn:th-menu' : 'typcn:th-menu-outline'" :class="isActive('/settings') ? 'text-[#E67E22]' : ''" height="30"/>
            <span>Paramètres</span>
          </router-link>
          <button id="button-mobile" @click="logout">Déconnexion</button>
        </div>
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
    box-sizing: border-box;
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

/* Styles responsives */
@media (max-width: 1023px) {
  .nav-right, .nav-img {
    display: none;
  }
  
  .search {
    width: 100%;
    margin-left: 15px;
    margin-right: 15px;
  }
  
  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #F5F5DC;
    cursor: pointer;
    margin-left: auto;
    z-index: 1001;
  }
}

@media (min-width: 1024px) {
  .mobile-menu-toggle {
    display: none;
  }
}

/* Menu mobile */
.mobile-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu-container.open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 75%;
  max-width: 300px;
  height: 100%;
  background-color: #010310;
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
}

.mobile-menu-container.open .mobile-menu {
  transform: translateX(0);
}

.mobile-menu a, .mobile-menu button {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.mobile-menu a:hover, .mobile-menu button:hover {
  background-color: rgba(230, 126, 34, 0.1);
}

.mobile-menu a span, .mobile-menu button {
  margin-left: 12px;
  font-size: 14px;
}

#button-mobile {
  cursor: pointer;
  background-color: #E67E22;
  padding: 12px;
  border-radius: 20px;
  border: 2px solid #E67E22;
  transition: 0.5s;
  justify-content: center;
  margin-top: 20px;
}

#button-mobile:hover {
  background-color: transparent;
  color: #E67E22;
}

@media (max-width: 640px) {
  .nav-left img {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .mobile-menu {
    width: 85%;
  }
}
</style>