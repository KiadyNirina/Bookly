<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { ref, onMounted } from 'vue';

const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(4);

loadMore();

const categories = ref([
  'Romance', 'Fantaisie', 'Histoire', 'Fiction', 
  'Non fiction', 'Comédie', 'Action', 'Science-fiction',
  'Horreur', 'Biographie', 'Aventure', 'Mystère'
]);

const activeCategory = ref('Tous');

const filterByCategory = (category) => {
  activeCategory.value = category;
};

const observerTarget = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore && !isLoading) {
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
      
      <div class="mb-20 text-center md:text-left">
        <div class="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
          <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">Explorez l'infini</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-none">
          Notre <span class="text-orange-500">Bibliothèque</span>
        </h1>
        
        <div class="relative">
          <div class="flex flex-wrap gap-x-8 gap-y-4 border-b border-white/5 pb-6">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="filterByCategory(category)"
              :class="[
                'text-xs font-black uppercase tracking-widest transition-all duration-300 relative py-2',
                activeCategory === category 
                  ? 'text-orange-500' 
                  : 'text-white/30 hover:text-white'
              ]"
            >
              {{ category }}
              <span v-if="activeCategory === category" class="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
            </button>
          </div>
        </div>
      </div>

      <section class="mb-24">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter flex items-center">
              <span class="text-orange-500 mr-3 text-4xl">/</span> Populaires
            </h2>
          </div>
          <router-link to="/books/popular" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-orange-500 transition-colors">
            Voir la sélection
          </router-link>
        </div>

        <!-- ✨ CARDS CORRIGÉES - IDENTIQUES À LA SECTION PROFIL ✨ -->
        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books" 
            :key="index" 
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
                      <span class="text-xs font-medium text-white">{{ book.views || '1.2k' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.comments_count || '48' }}</span>
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

              <!-- Badge "Populaire" (si applicable) -->
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
      </section>

      <section class="mb-16">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter flex items-center">
              <span class="text-orange-500 mr-3 text-4xl">/</span> Nouveautés
            </h2>
          </div>
          <a href="/books/recent" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-orange-500 transition-colors">
            Voir plus
          </a>
        </div>

        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books" 
            :key="index" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <a :href="`/books/${book.id}`" class="h-full w-full block">
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
                      <span class="text-xs font-medium text-white">{{ book.views || '1.2k' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.comments_count || '48' }}</span>
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

              <!-- Badge "Populaire" (si applicable) -->
              <div 
                v-if="book.isPopular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22]"
              ></div>
            </a>
          </div>
        </div>

        <!-- Infinite scroll loader -->
        <div ref="observerTarget" class="mt-20 py-10 flex flex-col items-center">
          <div v-if="isLoading" class="flex gap-2">
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          </div>
          <p v-else-if="!hasMore" class="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Fin de la collection</p>
        </div>
      </section>
    </div>
  </main>
</template>