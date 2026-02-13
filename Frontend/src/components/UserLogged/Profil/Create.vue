<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useUser } from '@/composables/useUser';
import { useFollowers } from '@/composables/useFollowers';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';
import { useBook } from '@/composables/useBook';
import CreateBook from '../Book/createBook.vue';

const { user, isLoggedIn } = useUser();
const { followersCount, followingCount, fetchFollowersCount, fetchFollowingCount } = useFollowers();
const { books, isLoading, hasMore, loadMoreUserBook } = useLoadMoreBooks(4);
const { countBook, fetchBookCount } = useBook();

const popupVisible = ref(false);
const activeTab = ref('created');
const isMobile = ref(false);
const isComponentMounted = ref(true);

const getImageUrl = (imgPath) => `http://localhost:8000/${imgPath}`;
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const create = () => { popupVisible.value = true; };
const checkScreenSize = () => { isMobile.value = window.innerWidth < 768; };

watch(() => user.value, (newUser) => {
    if (newUser?.id && isComponentMounted.value) {
      fetchFollowersCount(newUser.id);
      fetchFollowingCount(newUser.id);
    }
}, { immediate: true });

onMounted(async () => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  fetchBookCount();
  await nextTick();
  if (isComponentMounted.value) loadMoreUserBook();
});

onUnmounted(() => {
  isComponentMounted.value = false;
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <main class="min-h-screen text-white pt-24 pb-12">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full"></div>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-orange-500 p-1.5 transition-transform hover:rotate-3 duration-500">
              <div class="w-full h-full bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-5xl font-light text-white">
                  {{ isLoggedIn && user?.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 class="text-4xl font-bold tracking-tight text-white">
                {{ isLoggedIn ? user?.name : 'Utilisateur' }}
              </h1>
              <span class="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full self-center">
                Auteur
              </span>
            </div>
            <p class="text-white/50 text-sm mb-8">Membre depuis {{ formatDate(user?.created_at) }}</p>

            <div class="grid grid-cols-3 gap-4 max-w-sm mx-auto md:mx-0 mb-8">
              <div v-for="(val, label) in { 'Abonnés': followersCount, 'Abonnements': followingCount, 'Livres': countBook }" :key="label" 
                class="border-l border-white/10 pl-4">
                <p class="text-2xl font-bold text-orange-500 leading-none">{{ val ?? 0 }}</p>
                <p class="text-white/40 text-[10px] uppercase tracking-wider mt-1">{{ label }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              <router-link to="/settings" class="px-8 py-3 bg-white text-black hover:bg-orange-500 hover:text-white font-bold rounded-full transition-all duration-300 flex items-center">
                <Icon icon="lucide:edit-3" class="mr-2" /> Modifier
              </router-link>
              <button class="px-8 py-3 border border-white/20 hover:border-orange-500 text-white rounded-full transition-all flex items-center group">
                <Icon icon="lucide:share-2" class="mr-2 group-hover:text-orange-500" /> Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-12">
        <div class="inline-flex bg-white/5 p-1.5 rounded-full border border-white/10">
          <button 
            v-for="tab in [{id:'created', label:'Mes Créations', icon:'lucide:pen-tool'}, {id:'saved', label:'Enregistrés', icon:'lucide:bookmark'}]" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2',
              activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'
            ]"
          >
            <Icon :icon="tab.icon" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <section>
        <div class="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h2 class="text-xl font-medium text-white/90 uppercase tracking-widest px-4 border-l-4 border-orange-500">Bibliothèque</h2>
          <button @click="create" class="group flex items-center gap-2 text-sm text-orange-500 font-bold hover:text-white transition-colors">
            NOUVEAU LIVRE <Icon icon="lucide:plus-circle" class="text-xl transition-transform group-hover:rotate-90" />
          </button>
        </div>

        <div v-if="books.length === 0 && !isLoading" class="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-[#1a1c26]/20">
          <Icon icon="lucide:book-x" class="text-5xl text-orange-500/20 mx-auto mb-6" />
          <p class="text-xl font-black italic text-white/60 mb-2">Votre plume n'attend que vous...</p>
          <p class="text-[11px] uppercase tracking-widest text-white/30">Commencez à publier votre premier livre</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(book, index) in books" :key="index" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <a :href="`/books/${book.id}`" class="h-full w-full block">
              <img 
                :src="book.picture ? getImageUrl(book.picture) : '/default.jpg'" 
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

              <div 
                v-if="book.is_popular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22] z-10"
              ></div>
            </a>
          </div>
        </div>

        <div v-if="hasMore" class="mt-16 text-center">
          <button @click="loadMoreUserBook" class="relative overflow-hidden px-12 py-4 group border border-orange-500 text-orange-500 font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors duration-300">
            <span class="relative z-10">{{ isLoading ? 'Chargement...' : 'Afficher Plus' }}</span>
            <div class="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </section>

      <CreateBook :visible="popupVisible" @close="popupVisible = false" />
    </div>
  </main>
</template>

<style scoped>
/* Suppression des styles complexes pour laisser Tailwind respirer */
.container {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>