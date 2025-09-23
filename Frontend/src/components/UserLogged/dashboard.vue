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
  <main class="min-h-screen text-white pt-20 pb-12">
    <div class="container mx-auto px-4">
      <!-- En-tête avec titre et filtres -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
          Découvrez notre bibliothèque
        </h1>
        
        <!-- Filtres par catégorie -->
        <div class="mb-10">
          <!-- Desktop Horizontal Scroll -->
          <div class="hidden md:flex flex-wrap gap-3">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="filterByCategory(category)"
              :class="[
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105',
                activeCategory === category 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-gray-800 bg-opacity-60 text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              {{ category }}
            </button>
          </div>
          
          <!-- Mobile Horizontal Scroll -->
          <div class="md:hidden overflow-x-auto pb-4 hide-scrollbar">
            <div class="flex space-x-3 w-max px-1">
              <button 
                v-for="category in categories.slice(0, 7)" 
                :key="category"
                @click="filterByCategory(category)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
                  activeCategory === category 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-800 bg-opacity-60 text-gray-300 hover:bg-gray-700'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION POPULAIRES -->
      <section class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold flex items-center">
            <Icon icon="mdi:fire" class="text-orange-500 mr-2" />
            Les Plus Populaires
          </h2>
          <router-link 
            to="/books/popular" 
            class="text-orange-400 hover:text-orange-300 flex items-center transition-colors group"
          >
            Voir plus
            <Icon icon="ic:round-arrow-forward" class="ml-2 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books" 
            :key="index" 
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1"
          >
            <router-link :to="`/books/${book.id}`" class="block h-full">
              <div class="relative">
                <div v-if="book.isPopular" class="absolute top-3 left-3 z-10">
                  <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Icon icon="mdi:fire" class="mr-1" />
                    Populaire
                  </span>
                </div>
                <div v-else-if="book.isRecommended" class="absolute top-3 left-3 z-10">
                  <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Icon icon="mdi:thumb-up" class="mr-1" />
                    Recommandé
                  </span>
                </div>
                <img 
                  :src="getImageUrl(book.picture)" 
                  :alt="book.title" 
                  class="w-full h-60 object-cover"
                />
                <span class="absolute top-3 right-3 bg-blue-900 bg-opacity-70 text-blue-200 text-xs font-semibold px-2 py-1 rounded">
                  Fiction
                </span>
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ book.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 line-clamp-1">{{ book.author }}</p>
                
                <div class="text-xs text-gray-500 mb-4">
                  <p class="line-clamp-1">Publié par <span class="font-semibold text-gray-300">{{ book.posted_by.name }}</span></p>
                  <p>Le <span class="font-semibold text-gray-300">{{ formatDate(book.created_at) }}</span></p>
                  <p>Langue : <span class="font-semibold text-gray-300">{{ book.lang || 'FR' }}</span></p>
                </div>
                
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-0.5" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-orange-500" />
                  </div>
                  
                  <div class="flex space-x-3">
                    <span class="flex items-center">
                      <Icon icon="entypo:eye" class="mr-1" />
                      1,3k
                    </span>
                    <span class="flex items-center">
                      <Icon icon="iconamoon:comment-fill" class="mr-1" />
                      112
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-else-if="!isLoading" class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Aucun livre populaire disponible pour le moment</p>
        </div>

        <!-- Indicateur de chargement -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden animate-pulse">
            <div class="h-60 bg-gray-700"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-700 rounded"></div>
              <div class="h-3 bg-gray-700 rounded"></div>
              <div class="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION DERNIERS AJOUTS -->
      <section class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold flex items-center">
            <Icon icon="mdi:new-box" class="text-blue-500 mr-2" />
            Les Derniers Ajouts
          </h2>
          <router-link 
            to="/books/recent" 
            class="text-blue-400 hover:text-blue-300 flex items-center transition-colors group"
          >
            Voir plus
            <Icon icon="ic:round-arrow-forward" class="ml-2 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books" 
            :key="index" 
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
          >
            <router-link :to="`/books/${book.id}`" class="block h-full">
              <div class="relative">
                <div class="absolute top-3 right-3 bg-blue-900 bg-opacity-70 text-blue-200 text-xs font-semibold px-2 py-1 rounded">
                  Fiction
                </div>
                <img 
                  :src="getImageUrl(book.picture)" 
                  :alt="book.title" 
                  class="w-full h-60 object-cover"
                />
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ book.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 line-clamp-1">{{ book.author }}</p>
                
                <div class="text-xs text-gray-500 mb-4">
                  <p class="line-clamp-1">Publié par <span class="font-semibold text-gray-300">{{ book.posted_by.name }}</span></p>
                  <p>Le <span class="font-semibold text-gray-300">{{ formatDate(book.created_at) }}</span></p>
                  <p>Langue : <span class="font-semibold text-gray-300">{{ book.lang }}</span></p>
                </div>
                
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-0.5" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-orange-500" />
                  </div>
                  
                  <div class="flex space-x-3">
                    <span class="flex items-center">
                      <Icon icon="entypo:eye" class="mr-1" />
                      1,3k
                    </span>
                    <span class="flex items-center">
                      <Icon icon="iconamoon:comment-fill" class="mr-1" />
                      112
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-else-if="!isLoading" class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Aucun livre récent disponible pour le moment</p>
        </div>

        <!-- Chargement infini -->
        <div ref="observerTarget" class="text-center py-8">
          <div v-if="isLoading" class="flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
          <p v-else-if="!hasMore && books.length > 0" class="text-gray-400">
            Vous avez atteint la fin de la liste
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for webkit browsers */
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

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>