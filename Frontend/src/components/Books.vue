<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { ref, onMounted, computed } from 'vue';
import { useBook } from '@/composables/useBook';
import { useRouter } from 'vue-router'

const router = useRouter()

const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(4);

const { genres, fetchBookGenres, genresLoading, genresError } = useBook()

const activeCategory = ref('Tous');

// Charger les données initiales
onMounted(() => {
  loadMore()        
  fetchBookGenres()  
})

// Catégories dynamiques avec fallback
const displayCategories = computed(() => {
  const base = ['Tous']
  
  if (Array.isArray(genres.value) && genres.value.length > 0) {
    const validGenres = genres.value
      .filter(g => typeof g === 'string' && g.trim() !== '')
      .map(g => g.trim())
    
    return [...base, ...validGenres]
  }
  
  return base
})

// Filtrage avec navigation router
const filterByCategory = (category) => {
  activeCategory.value = category;
  if (category !== 'Tous') {
    router.push({
      path: '/books/recent',
      query: { genre: category }
    })
  } else {
    router.push({ path: '/books/recent' })
  }
}

// Infinite scroll observer
const observerTarget = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore.value && !isLoading.value) {
        loadMore();
      }
    },
    { threshold: 0.5 }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }

  return () => {
    if (observerTarget.value) {
      observer.unobserve(observerTarget.value);
    }
  };
});

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
}

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
}
</script>

<template>
  <main class="min-h-screen text-white pt-28 pb-20">
    <div class="container mx-auto px-6 max-w-7xl">
      
      <!-- HERO SECTION -->
      <div class="mb-20 text-center md:text-left">
        <div class="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
          <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">Explorez l'infini</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-none">
          Notre <span class="text-orange-500">Bibliothèque</span>
        </h1>
        
        <!-- FILTRES CATÉGORIES -->
        <div class="relative">
          <div v-if="genresLoading" class="flex justify-center py-6">
            <Icon icon="eos-icons:loading" class="animate-spin text-3xl text-orange-500" />
          </div>

          <div v-else-if="genresError" class="text-center py-6 text-red-400">
            {{ genresError }}
            <button 
              @click="fetchBookGenres" 
              class="ml-3 text-orange-500 hover:underline"
            >
              Réessayer
            </button>
          </div>

          <div v-else class="flex flex-wrap gap-x-8 gap-y-4 border-b border-white/5 pb-6">
            <button 
              v-for="category in displayCategories" 
              :key="category"
              @click="filterByCategory(category)"
              :class="[
                'text-xs font-black uppercase tracking-widest transition-all duration-300 relative py-2 px-1 cursor-pointer',
                activeCategory === category 
                  ? 'text-orange-500 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500' 
                  : 'text-white/50 hover:text-white'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- SECTION POPULAIRES -->
      <section class="mb-24">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter flex items-center">
              <span class="text-orange-500 mr-3 text-4xl">/</span> Populaires
            </h2>
          </div>
          <router-link 
            to="/books/popular" 
            class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-orange-500 transition-colors"
          >
            Voir la sélection
          </router-link>
        </div>

        <!-- CARTES LIVRES -->
        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books.slice(0, 4)" 
            :key="book.id || index" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <router-link :to="`/books/${book.id}`" class="h-full w-full block">
              <!-- Image avec effets hover -->
              <img 
                :src="getImageUrl(book.picture)" 
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-40"
              />
              
              <!-- Overlay dégradé -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <!-- Badge genre en haut à droite -->
              <div class="absolute top-4 right-4">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (book.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <!-- Contenu principal -->
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ book.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ book.title }}
                  </h3>
                  
                  <!-- Ligne orange animée -->
                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover:w-full"></div>

                  <!-- Statistiques (apparaissent au hover) -->
                  <div class="flex items-center gap-4 translate-y-0 transition-all duration-500 delay-100">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:eye" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.views_count }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.comments_count || '112' }}</span>
                    </div>
                    <div class="ml-auto flex gap-0.5">
                      <Icon 
                        v-for="i in 5" 
                        :key="i" 
                        icon="flowbite:star-solid" 
                        class="w-3 h-3 text-orange-500 fill-current" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Badge "Populaire" animé -->
              <div 
                v-if="book.isPopular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22]"
              ></div>
            </router-link>
          </div>
        </div>

        <!-- Skeleton loading -->
        <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="aspect-[2/3] bg-[#1a1c26] rounded-2xl border border-white/5"></div>
          </div>
        </div>

        <!-- État vide -->
        <div v-else-if="!isLoading && books.length === 0" class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Pas de livre disponible pour le moment</p>
        </div>
      </section>

      <!-- SECTION NOUVEAUTÉS -->
      <section class="mb-16">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter flex items-center">
              <span class="text-orange-500 mr-3 text-4xl">/</span> Nouveautés
            </h2>
          </div>
          <router-link 
            to="/books/recent" 
            class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-orange-500 transition-colors"
          >
            Voir plus
          </router-link>
        </div>

        <!-- CARTES LIVRES -->
        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books.slice(0, 4)" 
            :key="book.id || index" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <router-link :to="`/books/${book.id}`" class="h-full w-full block">
              <!-- Image avec effets hover -->
              <img 
                :src="getImageUrl(book.picture)" 
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-40"
              />
              
              <!-- Overlay dégradé -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <!-- Badge genre en haut à droite -->
              <div class="absolute top-4 right-4">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (book.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <!-- Contenu principal -->
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ book.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ book.title }}
                  </h3>
                  
                  <!-- Ligne orange animée -->
                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover:w-full"></div>

                  <!-- Statistiques (apparaissent au hover) -->
                  <div class="flex items-center gap-4 translate-y-0 transition-all duration-500 delay-100">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:eye" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.views_count }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.comments_count || '112' }}</span>
                    </div>
                    <div class="ml-auto flex gap-0.5">
                      <Icon 
                        v-for="i in 5" 
                        :key="i" 
                        icon="flowbite:star-solid" 
                        class="w-3 h-3 text-orange-500 fill-current" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Badge "Nouveau" animé -->
              <div 
                class="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3B82F6]"
              ></div>
            </router-link>
          </div>
        </div>

        <!-- Skeleton loading -->
        <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="aspect-[2/3] bg-[#1a1c26] rounded-2xl border border-white/5"></div>
          </div>
        </div>

        <!-- Infinite scroll loader -->
        <div ref="observerTarget" class="mt-20 py-10 flex flex-col items-center">
          <div v-if="isLoading" class="flex gap-2">
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          </div>
          <p v-else-if="!hasMore && books.length > 0" class="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
            Fin de la collection
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Animations personnalisées */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 8px #E67E22;
  }
  50% {
    box-shadow: 0 0 20px #E67E22, 0 0 30px #E67E22;
  }
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>