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

// Charger les livres initiaux
loadMore();

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
}

const categories = ref([
  'Romance', 'Fantaisie', 'Histoire', 'Fiction', 
  'Non fiction', 'Comédie', 'Action', 'Science-fiction',
  'Horreur', 'Biographie', 'Aventure', 'Mystère'
]);

// État pour la catégorie active
const activeCategory = ref('Tous');

// Fonction pour filtrer par catégorie
const filterByCategory = (category) => {
  activeCategory.value = category;
};

const observerTarget = ref(null);
const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });

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
</script>

<template>
  <main class="min-h-screen text-white pt-20">
    <div class="container mx-auto px-4 py-8">
      <!-- Filtres par catégorie -->
      <section class="mb-12">
      
        <!-- Desktop Horizontal Scroll -->
        <div class="hidden md:flex flex-wrap gap-3 justify-center md:justify-start">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="filterByCategory(category)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              activeCategory === category 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- Mobile Horizontal Scroll -->
        <div class="md:hidden overflow-x-auto pb-4 hide-scrollbar">
          <div class="flex space-x-3 w-max px-1">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="filterByCategory(category)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
                activeCategory === category 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </section>

      <!-- SECTION POPULAIRES -->
      <section class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Les Plus Populaires</h2>
          <router-link 
            to="/books/popular" 
            class="text-orange-400 hover:text-orange-300 flex items-center transition-colors"
          >
            Voir plus
            <Icon icon="ic:round-arrow-forward" class="ml-2" />
          </router-link>
        </div>

        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(book, index) in books" 
            :key="index" 
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20"
          >
            <router-link :to="`/books/detail/${book.id}`" class="block h-full">
              <div class="relative">
                <div class="absolute top-3 left-3 z-10">
                  <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
                </div>
                <img 
                  :src="getImageUrl(book.picture)" 
                  :alt="book.title" 
                  class="w-full h-60 object-cover"
                />
              </div>
              
              <div class="p-4">
                <span class="inline-block bg-blue-900 bg-opacity-50 text-blue-200 text-xs font-semibold px-2 py-1 rounded mb-3">Fiction</span>
                
                <h3 class="text-lg font-bold text-white mb-1 truncate">{{ book.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 truncate">{{ book.author }}</p>
                
                <div class="text-xs text-gray-500 mb-4">
                  <p class="truncate">Publié par <span class="font-semibold text-gray-300">{{ book.posted_by.name }}</span></p>
                  <p>Lang : <span class="font-semibold text-gray-300">{{ book.lang }}</span></p>
                </div>
                
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-1" v-for="i in 4" :key="i" />
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

        <div v-else class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Pas de livre disponible pour le moment</p>
        </div>
      </section>

      <!-- SECTION DERNIERS AJOUTS -->
      <section class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Les derniers ajouts</h2>
          <router-link 
            to="/books/recent" 
            class="text-orange-400 hover:text-orange-300 flex items-center transition-colors"
          >
            Voir plus
            <Icon icon="ic:round-arrow-forward" class="ml-2" />
          </router-link>
        </div>

        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="book in books" 
            :key="book.id" 
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <router-link :to="`/books/detail/${book.id}`" class="block h-full">
              <img 
                :src="getImageUrl(book.picture)" 
                :alt="book.title" 
                class="w-full h-60 object-cover"
              />
              
              <div class="p-4">
                <span class="inline-block bg-blue-900 bg-opacity-50 text-blue-200 text-xs font-semibold px-2 py-1 rounded mb-3">Fiction</span>
                
                <h3 class="text-lg font-bold text-white mb-1 truncate">{{ book.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 truncate">{{ book.author }}</p>
                
                <div class="text-xs text-gray-500 mb-4">
                  <p class="truncate">Publié par <span class="font-semibold text-gray-300">{{ book.posted_by.name }}</span></p>
                  <p>Le <span class="font-semibold text-gray-300">{{ book.created_at }}</span></p>
                  <p>Lang : <span class="font-semibold text-gray-300">{{ book.lang }}</span></p>
                </div>
                
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-1" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-orange-500" />
                  </div>
                  
                  <div class="flex space-x-3">
                    <span class="flex items-center">
                      <Icon icon="entypo:eye" class="mr-1" />
                      1,3k
                    </span>
                    <span class="flex items-center">
                      <Icon icon="ic:round-download" class="mr-1" />
                      900
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Pas de livre disponible pour le moment</p>
        </div>
      </section>

      <!-- Chargement infini -->
      <div ref="observerTarget" class="text-center py-8">
        <div v-if="isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
        <p v-else-if="!hasMore && books.length > 0" class="text-gray-400">
          Vous avez atteint la fin de la liste
        </p>
      </div>
    </div>
  </main>
</template>

<style>
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Animation pour l'apparition des livres */
.book-enter-active {
  transition: all 0.5s ease;
}
.book-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Custom scrollbar */
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