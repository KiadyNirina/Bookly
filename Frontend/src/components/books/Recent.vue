<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser';
import { ref, onMounted } from 'vue';

const { user } = useUser();
const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(8);

const activeCategory = ref('Tous');
const isMobile = ref(false);

const categories = ref([
  'Tous', 'Romance', 'Fantaisie', 'Histoire', 'Fiction', 
  'Non fiction', 'Comédie', 'Action', 'Science-fiction',
  'Horreur', 'Biographie', 'Aventure', 'Mystère'
]);

loadMore();

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
  <main class="min-h-screen text-white pt-20 pb-12">
    <div class="container mx-auto px-4">
      <!-- En-tête de la page -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Livres Récents
        </h1>
      </div>

      <!-- Filtres par catégorie -->
      <div class="mb-8">
        
        <!-- Desktop - Filtres complets -->
        <div class="hidden md:flex flex-wrap gap-3">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="filterByCategory(category)"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105',
              activeCategory === category 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-800 bg-opacity-60 text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- Mobile - Filtres avec défilement -->
        <div class="md:hidden overflow-x-auto pb-4 hide-scrollbar">
          <div class="flex space-x-3 w-max px-1">
            <button 
              v-for="category in categories.slice(0, 6)" 
              :key="category"
              @click="filterByCategory(category)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
                activeCategory === category 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-800 bg-opacity-60 text-gray-300 hover:bg-gray-700'
              ]"
            >
              {{ category }}
            </button>
            <button 
              v-if="categories.length > 6"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm"
            >
              +{{ categories.length - 6 }}
            </button>
          </div>
        </div>
      </div>

      <!-- Section des livres -->
      <section class="mb-12">
        <!-- En-tête de section -->
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold flex items-center">
            <Icon icon="mdi:new-box" class="text-blue-400 mr-3" />
            Les livres les plus récents
            <span v-if="books.length > 0" class="ml-3 text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {{ books.length }} livre(s)
            </span>
          </h2>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400 hidden md:block">Trier par :</span>
            <select class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
              <option>Plus récent</option>
              <option>Plus populaire</option>
              <option>Meilleures notes</option>
            </select>
          </div>
        </div>

        <!-- Grille des livres -->
        <div v-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="book in books" 
            :key="book.id"
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 group"
          >
            <router-link :to="`/books/${book.id}`" class="block h-full">
              <!-- Image du livre -->
              <div class="relative overflow-hidden">
                <img 
                  :src="getImageUrl(book.picture)" 
                  :alt="book.title"
                  class="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                <!-- Badge du genre -->
                <span class="absolute top-3 left-3 bg-blue-900 bg-opacity-80 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
                  {{ book.genre || 'Fiction' }}
                </span>
              </div>

              <!-- Informations du livre -->
              <div class="p-4">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">
                  {{ book.title }}
                </h3>
                <p class="text-sm text-gray-400 mb-3 line-clamp-1">Par {{ book.author }}</p>
                
                <!-- Métadonnées -->
                <div class="text-xs text-gray-500 mb-4 space-y-1">
                  <p class="line-clamp-1">
                    Publié par <span class="font-semibold text-gray-300">{{ book.posted_by.name }}</span>
                  </p>
                  <p>Le <span class="font-semibold text-gray-300">{{ formatDate(book.created_at) }}</span></p>
                  <p>Langue : <span class="font-semibold text-gray-300">{{ book.lang || 'FR' }}</span></p>
                </div>

                <!-- Statistiques -->
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <!-- Notes -->
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-yellow-500 mr-0.5" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-yellow-500" />
                    <span class="text-xs text-gray-500 ml-1">(4.0)</span>
                  </div>
                  
                  <!-- Interactions -->
                  <div class="flex space-x-3">
                    <span class="flex items-center" title="Vues">
                      <Icon icon="entypo:eye" class="mr-1 text-blue-400" />
                      <span class="text-xs">1,3k</span>
                    </span>
                    <span class="flex items-center" title="Commentaires">
                      <Icon icon="iconamoon:comment-fill" class="mr-1 text-green-400" />
                      <span class="text-xs">112</span>
                    </span>
                    <span class="flex items-center" title="Téléchargements">
                      <Icon icon="ic:round-download" class="mr-1 text-purple-400" />
                      <span class="text-xs">900</span>
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- État de chargement -->
        <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden animate-pulse">
            <div class="h-60 bg-gray-700"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-700 rounded w-1/2"></div>
              <div class="h-3 bg-gray-700 rounded w-2/3"></div>
              <div class="flex justify-between">
                <div class="h-4 bg-gray-700 rounded w-1/4"></div>
                <div class="h-4 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-16">
          <Icon icon="mdi:book-search-outline" class="text-6xl text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-300 mb-2">Aucun livre trouvé</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            Aucun livre récent n'est disponible pour le moment. Revenez plus tard pour découvrir de nouvelles publications.
          </p>
        </div>

        <!-- Bouton Voir plus -->
        <div v-if="hasMore && books.length > 0" class="text-center mt-12">
          <button
            @click="loadMore"
            :disabled="isLoading"
            :class="[
              'px-8 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105',
              'flex items-center mx-auto space-x-2',
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'
            ]"
          >
            <Icon 
              :icon="isLoading ? 'svg-spinners:ring-resize' : 'mdi:autorenew'" 
              class="text-xl"
              :class="{'animate-spin': isLoading}"
            />
            <span>{{ isLoading ? 'Chargement...' : 'Charger plus de livres' }}</span>
          </button>
        </div>

        <!-- Message de fin -->
        <div v-else-if="books.length > 0" class="text-center mt-8">
          <p class="text-gray-500 flex items-center justify-center">
            <Icon icon="mdi:check-circle-outline" class="mr-2 text-green-500" />
            Vous avez atteint la fin de la liste
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
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

/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.book-enter {
  animation: fadeInUp 0.5s ease-out;
}

/* Scrollbar personnalisée pour le contenu défilant */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Effet de brillance au survol */
.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
</style>