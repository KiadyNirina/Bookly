<script setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import apiClient from '@/plugins/axios';
import { Icon } from '@iconify/vue';

const route = useRoute();
const results = ref({ books: [], users: [] });

const fetchResults = async (query) => {
  try {
    const res = await apiClient.get('/search', { params: { q: query } });
    results.value = res.data;
  } catch {
    results.value = { books: [], users: [] };
  }
};

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
}

watch(
  () => route.query.q,
  (q) => {
    if (q) fetchResults(q);
    else results.value = { books: [], users: [] };
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen text-white pt-28 pb-20 px-6">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-16 border-b border-white/5 pb-10">
        <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Exploration</span>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          Résultats pour <span class="text-orange-500">"{{ route.query.q }}"</span>
        </h1>
      </div>

      <div v-if="loading" class="flex flex-col items-center py-24">
        <div class="relative">
          <div class="w-16 h-16 rounded-full border-4 border-white/10 border-t-orange-500 animate-spin"></div>
          <Icon icon="lucide:search" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 text-xl" />
        </div>
        <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mt-6">Fouille en profondeur...</p>
      </div>

      <div v-else class="space-y-24">
        
        <!-- Section Utilisateurs -->
        <section v-if="results.users.length > 0">
          <div class="flex items-center gap-4 mb-10">
            <div class="flex items-center">
              <span class="text-orange-500 text-xl mr-2">/</span>
              <h2 class="text-3xl font-black uppercase tracking-tighter">
                Profils <span class="text-orange-500">({{ results.users.length }})</span>
              </h2>
            </div>
            <div class="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <router-link 
              v-for="user in results.users" 
              :key="user.id" 
              :to="`/profile/${user.id}`"
              class="group flex items-center p-6 bg-[#1a1c26] border border-white/5 rounded-2xl hover:border-orange-500 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div class="relative w-14 h-14 flex-shrink-0">
                <div class="absolute inset-0 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f1117]"></div>
              </div>
              
              <div class="flex-1 ml-5">
                <h4 class="text-xl font-black leading-tight group-hover:text-orange-500 transition-colors truncate">
                  {{ user.name }}
                </h4>
                <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 truncate">
                  {{ user.email }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-[9px] text-orange-500 font-black tracking-widest">LECTEUR ACTIF</span>
                  <span class="text-[8px] text-white/20">•</span>
                  <span class="text-[9px] text-white/30">{{ user.books_count || 0 }} livres</span>
                </div>
              </div>
              
              <div class="ml-4 p-2 rounded-full border border-white/5 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all">
                <Icon icon="lucide:arrow-right" class="text-white/30 group-hover:text-orange-500 w-4 h-4 transition-colors" />
              </div>
            </router-link>
          </div>
        </section>

        <!-- Section Livres -->
        <section v-if="results.books.length > 0">
          <div class="flex items-center gap-4 mb-10">
            <div class="flex items-center">
              <span class="text-orange-500 text-xl mr-2">/</span>
              <h2 class="text-3xl font-black uppercase tracking-tighter">
                Livres <span class="text-orange-500">({{ results.books.length }})</span>
              </h2>
            </div>
            <div class="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="book in results.books" 
              :key="book.id" 
              class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
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
                        <Icon icon="lucide:download" class="text-orange-500 w-4 h-4" />
                        <span class="text-xs font-medium text-white">{{ book.downloads || '900' }}</span>
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

                <div 
                  v-if="book.is_popular" 
                  class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22] z-10"
                ></div>
              </a>
            </div>
          </div>
        </section>

        <div v-if="results.books.length === 0 && results.users.length === 0" 
          class="text-center py-32 border border-dashed border-white/5 rounded-3xl bg-[#1a1c26]/30">
          <div class="relative inline-block mb-8">
            <div class="w-24 h-24 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
              <Icon icon="lucide:search-x" class="text-5xl text-orange-500/20" />
            </div>
            <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-4 border-[#0f1117] flex items-center justify-center">
              <Icon icon="lucide:x" class="text-black text-xs font-black" />
            </div>
          </div>
          <h3 class="text-2xl font-black italic text-white/60 mb-3">Aucun trésor trouvé</h3>
          <p class="text-[11px] uppercase tracking-widest text-white/40 max-w-md mx-auto">
            Explorez d'autres horizons littéraires ou affinez votre quête avec de nouveaux mots-clés
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-orange-500 transition-colors">
              Explorer la collection
            </button>
            <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-orange-500 text-black hover:bg-orange-400 transition-colors">
              Suggestions aléatoires
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(1.5); opacity: 0; }
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>