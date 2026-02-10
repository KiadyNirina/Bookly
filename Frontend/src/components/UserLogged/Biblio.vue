<script setup>
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';
import { useUser } from '@/composables/useUser';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';

const { user, isLoggedIn, isUserLoading } = useUser();
const { books, isLoading, hasMore, error, loadMoreUserBook } = useLoadMoreBooks(4);

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  loadMoreUserBook();
});

</script>

<template>
  <div class="min-h-screen text-white pt-28 pb-20 px-6">
    <div class="container max-w-7xl mx-auto space-y-24">
      
      <section v-for="section in [
        { title: 'Publiés', data: books, link: '/books/posted', empty: 'commencez à partager un livre' },
        { title: 'Enregistrés', data: books, link: '/books/popular', empty: 'commencez à enregistrer un livre' },
        { title: 'Téléchargés', data: books, link: '#', empty: 'commencez à télécharger un livre' }
      ]" :key="section.title" class="group">
        
        <div class="flex items-end justify-between mb-10 border-b border-white/5 pb-6">
          <div class="flex items-center gap-4">
            <span class="w-2 h-8 bg-orange-500"></span>
            <h2 class="text-4xl font-black italic tracking-tighter uppercase">{{ section.title }}</h2>
          </div>
          <router-link :to="section.link" class="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 hover:text-white transition-colors flex items-center gap-2">
            Voir tout <Icon icon="lucide:arrow-right" class="text-sm" />
          </router-link>
        </div>

        <div v-if="section.data.length === 0" class="py-16 px-8 border border-dashed border-white/5 rounded-2xl bg-[#1a1c26]/20 text-center">
          <Icon icon="lucide:book-open" class="text-4xl text-orange-500/20 mx-auto mb-6" />
          <p class="text-[11px] uppercase tracking-widest text-white/40 font-medium">
            {{ section.empty }}
          </p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in section.data.slice(0, 4)" 
            :key="index" 
            class="group/card relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <a :href="`/books/${book.id}`" class="h-full w-full block">
              
              <img 
                :src="getImageUrl(book.picture)" 
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-40"
                loading="lazy"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <div class="absolute top-4 right-4 z-10">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (book.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <div class="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div class="transform transition-transform duration-500 group-hover/card:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ book.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ book.title }}
                  </h3>
                  
                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover/card:w-full"></div>

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
                        icon="lucide:star" 
                        class="w-3 h-3 text-orange-500 fill-current" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div 
                v-if="book.is_popular || book.is_recommended" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22] z-10"
              ></div>
            </a>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

html {
  scroll-behavior: smooth;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
.popular-badge {
  animation: pulse 2s infinite;
}
</style>