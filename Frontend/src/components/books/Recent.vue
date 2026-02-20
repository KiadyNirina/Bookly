<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser';
import { useBook } from '@/composables/useBook';
import { ref, onMounted, computed } from 'vue';

const { user } = useUser();
const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(8);

const { genres, fetchBookGenres, genresLoading, genresError } = useBook()

const activeCategory = ref('Tous');
const isMobile = ref(false);

onMounted(() => {
  loadMore()        
  fetchBookGenres()  
})

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

const filteredBooks = computed(() => {
  if (activeCategory.value === 'Tous') {
    return books.value
  }

  return books.value.filter(book => 
    book.genre?.toLowerCase() === activeCategory.value.toLowerCase()
  )
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

const filterByCategory = (category) => {
  activeCategory.value = category;
};

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
</script>

<template>
  <main class="min-h-screen text-white pt-28 pb-20">
    <div class="container mx-auto px-6 max-w-7xl">
      
      <div class="mb-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Nouveautés</span>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Livres <span class="text-orange-500">Récents</span>
            </h1>
          </div>
          <div v-if="books.length > 0" class="flex flex-col items-start md:items-end gap-2">
            <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">Collection actuelle</span>
            <span class="text-2xl font-black tracking-tighter">{{ books.length }} <span class="text-orange-500 text-sm italic">volumes</span></span>
          </div>
        </div>
      </div>

      <div class="flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <nav class="w-full lg:w-auto overflow-x-auto hide-scrollbar">
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
                  'text-xs font-black uppercase tracking-widest transition-all duration-300 relative py-2 px-1',
                  activeCategory === category 
                    ? 'text-orange-500 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500' 
                    : 'text-white/50 hover:text-white'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </nav>

        <div class="flex items-center gap-4 min-w-[220px] mt-4">

          <span class="text-sm font-bold uppercase tracking-widest text-white/40">
            Trier par
          </span>

          <div class="relative">
            <select
              class="w-full appearance-none bg-white/5 border border-white/10 
                    rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider 
                    text-white focus:outline-none focus:border-orange-500 
                    focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
            >
              <option class="bg-[#0b0d14]">Plus récent</option>
              <option class="bg-[#0b0d14]">Populaire</option>
              <option class="bg-[#0b0d14]">Meilleures notes</option>
            </select>

            <Icon 
              icon="lucide:chevron-down" 
              class="absolute right-3 top-1/2 -translate-y-1/2 
                    w-4 h-4 text-orange-500 pointer-events-none"
            />
          </div>

        </div>
      </div>

      <section class="mb-20">
        <div v-if="filteredBooks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="book in filteredBooks" 
            :key="book.id"
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer animate-stagger"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <a :href="`/books/${book.id}`" class="h-full w-full block">
              <img 
                :src="getImageUrl(book.picture)" 
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-40"
                loading="lazy"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <div class="absolute top-4 right-4 z-10">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (book.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <div class="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ book.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ book.title }}
                  </h3>
                  
                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover:w-full"></div>

                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:eye" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.views || '1.3k' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ book.comments_count || '112' }}</span>
                    </div>
                    <div class="ml-auto flex gap-0.5">
                      <Icon 
                        v-for="i in 5" 
                        :key="i" 
                        icon="lucide:star" 
                        class="w-3 h-3 text-orange-500 fill-current" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div 
                v-if="book.is_popular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22] z-10"
              ></div>
            </a>
          </div>
        </div>

        <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="animate-pulse">
            <div class="aspect-[2/3] bg-[#1a1c26] rounded-2xl border border-white/5"></div>
          </div>
        </div>

        <div v-else class="text-center py-32 border border-dashed border-white/5 rounded-3xl bg-[#1a1c26]/30">
          <Icon icon="lucide:book-x" class="text-4xl text-orange-500/20 mx-auto mb-6" />
          <h3 class="text-xl font-black italic uppercase tracking-tighter text-white/60">Aucun livre disponible</h3>
          <p class="text-white/40 mt-2">La collection sera bientôt enrichie de nouveaux trésors littéraires</p>
        </div>

        <div v-if="hasMore && books.length > 0" class="text-center mt-20">
          <button
            @click="loadMore"
            :disabled="isLoading"
            class="group relative px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all overflow-hidden border border-white/10 hover:border-orange-500 disabled:opacity-50"
          >
            <span :class="{'opacity-0': isLoading}" class="relative z-10 group-hover:text-white transition-colors">Charger plus</span>
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
              <Icon icon="lucide:loader-2" class="animate-spin text-orange-500 text-xl" />
            </div>
            <div class="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>

        <div v-else-if="books.length > 0" class="text-center mt-20">
          <span class="text-[10px] font-black uppercase tracking-[0.6em] text-orange-500/20">Fin du catalogue</span>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Amélioration de la lisibilité des cartes */
@supports (backdrop-filter: blur(10px)) {
  .card-badge {
    backdrop-filter: blur(4px);
  }
}

/* Animation subtile pour les étoiles */
@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
.popular-badge {
  animation: pulse 2s infinite;
}

.animate-stagger {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>