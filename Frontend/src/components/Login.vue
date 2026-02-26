<script setup>
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
    email,
    password,
    isPasswordVisible,
    errorMess,
    hasError,
    isLoading,
    login,
    initializeGoogleLogin,
    isAuthenticated
} = useAuth();

const showPassword = ref(false);
const isMobile = ref(window.innerWidth < 768);

onMounted(() => {
  // 🔐 Rediriger si déjà connecté
  if (isAuthenticated.value) {
    router.push('/dashboard');
    return;
  }
  
  initializeGoogleLogin();
  
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <main class="min-h-screen flex items-center justify-center md:py-20 p-4 md:p-6 relative overflow-hidden">
    
    <!-- ✨ Background décoratif -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- 📦 Card principale -->
    <div class="w-full max-w-5xl bg-[#1a1c26]/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5 relative z-10">
      
      <!-- 🖼️ Section Image (Desktop) -->
      <div class="hidden md:block md:w-1/2 relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-blue-500/20 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        <img 
          src="/giphy_book (4).gif" 
          alt="Bookly Animation" 
          class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1c26] via-[#1a1c26]/20 to-transparent"></div>
        
        <!-- Contenu texte -->
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <h2 class="text-3xl font-black text-white tracking-tighter mb-3">
            Bienvenue
          </h2>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Rejoignez une communauté de passionnés de lecture et partagez vos coups de cœur.
          </p>
        </div>
      </div>
      
      <!-- 📝 Section Formulaire -->
      <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
        
        <!-- Header mobile -->
        <div class="md:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-2xl mb-4">
            <Icon icon="lucide:book-open" class="w-6 h-6 text-orange-500" />
          </div>
          <h1 class="text-2xl font-black text-white tracking-tighter">
            Bookly
          </h1>
          <p class="text-gray-400 text-sm mt-1">Votre bibliothèque personnelle</p>
        </div>

        <!-- Header desktop -->
        <div class="hidden md:block mb-8">
          <div class="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
            <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">Connexion</span>
          </div>
          <h1 class="text-4xl font-black text-white tracking-tighter">
            Ravi de vous <span class="text-orange-500">revoir</span>
          </h1>
          <p class="text-gray-400 mt-2 text-sm">Connectez-vous pour accéder à votre espace</p>
        </div>

        <!-- Message d'erreur -->
        <transition name="slide-fade">
          <div 
            v-if="errorMess" 
            class="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
          >
            <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p class="text-red-300 text-sm leading-relaxed">{{ errorMess }}</p>
          </div>
        </transition>

        <!-- Formulaire -->
        <form @submit.prevent="login" class="space-y-5">
          
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="block text-xs font-black uppercase tracking-widest text-gray-400">
              Email
            </label>
            <div class="relative">
              <Icon icon="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                id="email"
                type="email" 
                v-model="email" 
                placeholder="vous@exemple.com"
                :class="{
                  'border-red-500/50 focus:ring-red-500/20': hasError, 
                  'focus:ring-orange-500/20 focus:border-orange-500': !hasError
                }"
                class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300" 
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="block text-xs font-black uppercase tracking-widest text-gray-400">
              Mot de passe
            </label>
            <div class="relative">
              <Icon icon="lucide:lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                id="password"
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="••••••••"
                :class="{
                  'border-red-500/50 focus:ring-red-500/20': hasError, 
                  'focus:ring-orange-500/20 focus:border-orange-500': !hasError
                }"
                class="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300" 
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon 
                  :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="w-5 h-5" 
                />
              </button>
            </div>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between pt-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <div class="relative">
                <input 
                  type="checkbox" 
                  v-model="showPassword" 
                  class="sr-only peer"
                />
                <div class="w-5 h-5 border-2 border-gray-600 rounded-md peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all duration-200 flex items-center justify-center">
                  <Icon v-if="showPassword" icon="lucide:check" class="w-3 h-3 text-white" />
                </div>
              </div>
              <span class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Voir</span>
            </label>
            
            <router-link 
              to="/forgot-password" 
              class="text-xs font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors"
            >
              Mot de passe oublié ?
            </router-link>
          </div>

          <!-- Bouton Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            <!-- Effet hover glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span class="relative flex items-center justify-center gap-2">
              <Icon
                v-if="isLoading"
                icon="eos-icons:loading"
                class="animate-spin w-4 h-4"
              />
              <Icon
                v-else
                icon="lucide:log-in"
                class="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="px-4 bg-[#1a1c26]/80 text-gray-500 text-xs font-black uppercase tracking-widest">
              Ou continuer avec
            </span>
          </div>
        </div>

        <!-- Google Sign In -->
        <div class="flex justify-center">
          <div 
            id="google-signin-button" 
            class="w-full max-w-xs [&>div]:w-full [&>div]:rounded-xl [&>div]:overflow-hidden"
          ></div>
        </div>

        <!-- Footer -->
        <p class="text-center text-gray-500 mt-8 text-xs">
          Pas encore de compte ? 
          <router-link 
            to="/signup" 
            class="text-orange-400 hover:text-orange-300 font-black uppercase tracking-widest transition-colors ml-1"
          >
            S'inscrire
          </router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Custom styles for Google button */
:deep(#google-signin-button > div) {
  border-radius: 12px !important;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

:deep(#google-signin-button > div:hover) {
  border-color: rgba(230, 126, 34, 0.5) !important;
}

/* Focus visible pour accessibilité */
input:focus-visible {
  outline: 2px solid rgba(230, 126, 34, 0.5);
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  main {
    padding: 1rem;
  }
}

@media (max-width: 400px) {
  .card-content {
    padding: 1.5rem;
  }
}
</style>