<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSearch } from '@/composables/useSearch';
import { Icon } from '@iconify/vue';

const route = useRoute();
const { isAuthenticated, logout } = useAuth();
const { searchQuery } = useSearch();

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const isActive = (path) => route.path === path || route.path.startsWith(path + '/');

const toggleMobileMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value);
const closeMobileMenu = () => (isMobileMenuOpen.value = false);

// Effet de changement de style au scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <nav 
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 py-3',
      isScrolled ? 'bg-[#191c2f]/90 backdrop-blur-lg shadow-xl' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <router-link to="/" class="flex-shrink-0 flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 transition-transform group-hover:scale-110">
          <img src="/logo.jpg" alt="Logo" class="w-full h-full object-cover">
        </div>
        <span class="hidden md:block font-bold text-white tracking-tight text-xl">LIVR<span class="text-orange-500">O</span></span>
      </router-link>

      <div class="hidden md:flex flex-grow max-w-xl relative group">
        <Icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un trésor..."
          class="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white/10 transition-all"
        />
      </div>

      <div class="hidden lg:flex items-center gap-6">
        <template v-if="!isAuthenticated">
          <router-link v-for="link in [['Accueil', '/'], ['Livres', '/books'], ['À propos', '/about']]" 
            :key="link[1]" :to="link[1]"
            :class="['relative py-1 text-sm font-medium transition-colors hover:text-orange-500', isActive(link[1]) ? 'text-orange-500' : 'text-gray-300']"
          >
            {{ link[0] }}
            <span v-if="isActive(link[1])" class="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>
          </router-link>
          
          <router-link to="/login" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(230,126,34,0.4)] active:scale-95">
            Connexion
          </router-link>
        </template>

        <template v-else>
          <div class="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
            <router-link v-for="item in [
              { path: '/dashboard', icon: 'lets-icons:home', iconActive: 'lets-icons:home-fill' },
              { path: '/biblio', icon: 'ic:outline-library-add', iconActive: 'ic:baseline-library-add' },
              { path: '/notif', icon: 'ri:notification-line', iconActive: 'ri:notification-fill' },
              { path: '/profil/create', icon: 'iconamoon:profile-light', iconActive: 'iconamoon:profile-fill' }
            ]" :key="item.path" :to="item.path"
              class="p-2 rounded-full transition-all"
              :class="isActive(item.path) ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
            >
              <Icon :icon="isActive(item.path) ? item.iconActive : item.icon" height="24" />
            </router-link>
          </div>
          
          <button @click="logout" class="text-gray-400 hover:text-red-400 transition-colors p-2">
            <Icon icon="lucide:log-out" height="24" />
          </button>
        </template>
      </div>

      <button class="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors" @click="toggleMobileMenu">
        <Icon :icon="isMobileMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-bottom-right-20-solid'" height="32" />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[60] lg:hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeMobileMenu"></div>
        
        <div class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-[#191c2f] p-8 shadow-2xl border-l border-white/10">
          <div class="flex flex-col h-full">
            <div class="flex justify-between items-center mb-10">
              <span class="text-xl font-bold text-white">Menu</span>
              <button @click="closeMobileMenu" class="text-gray-400 hover:text-white"><Icon icon="lucide:x" height="28" /></button>
            </div>

            <div class="relative mb-8">
              <input v-model="searchQuery" type="text" placeholder="Rechercher..." class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-orange-500">
            </div>

            <nav class="flex flex-col gap-4">
              <router-link 
                v-for="link in (isAuthenticated ? 
                  [['Dashboard', '/dashboard', 'home'], ['Ma Biblio', '/biblio', 'book'], ['Notifications', '/notif', 'bell'], ['Profil', '/profil/create', 'user']] : 
                  [['Accueil', '/', 'home'], ['Livres', '/books', 'book-open'], ['À propos', '/about', 'info']])" 
                :key="link[1]" :to="link[1]"
                class="flex items-center gap-4 p-4 rounded-xl transition-all"
                :class="isActive(link[1]) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'"
                @click="closeMobileMenu"
              >
                <Icon :icon="`lucide:${link[2]}`" height="20" />
                <span class="font-medium">{{ link[0] }}</span>
              </router-link>
            </nav>

            <div class="mt-auto pt-6 border-t border-white/10">
              <button v-if="isAuthenticated" @click="logout" class="w-full flex items-center justify-center gap-2 p-4 text-red-400 font-semibold hover:bg-red-400/10 rounded-xl transition-all">
                <Icon icon="lucide:log-out" /> Déconnexion
              </button>
              <router-link v-else to="/login" @click="closeMobileMenu" class="block w-full text-center bg-orange-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                Connexion
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>