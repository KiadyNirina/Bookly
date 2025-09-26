<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, watch } from 'vue';
import { useUser } from '@/composables/useUser';
import { useFollowers } from '@/composables/useFollowers';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';
import CreateBook from '../Book/createBook.vue';

const { user, isLoggedIn, isUserLoading } = useUser();
const { followersCount, followingCount, fetchFollowersCount, fetchFollowingCount } = useFollowers();
const { books, isLoading, hasMore, error, loadMoreUserBook } = useLoadMoreBooks(4);

const popupVisible = ref(false);
const activeTab = ref('created');
const isMobile = ref(false);

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

const create = () => {
  popupVisible.value = true;
};

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

watch(
  () => user.value,
  (newUser) => {
    if (newUser?.id) {
      fetchFollowersCount(newUser.id);
      fetchFollowingCount(newUser.id);
    }
  },
  { immediate: true }
);

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  loadMoreUserBook();
});
</script>

<template>
  <main class="min-h-screen text-white pt-20 pb-12">
    <div class="container mx-auto px-4 lg:px-8">
      <!-- En-tête du profil -->
      <div class="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 mb-8 border border-gray-700 shadow-xl">
        <div class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <span class="text-4xl lg:text-5xl font-bold text-white">
                {{ isLoggedIn && user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
              </span>
            </div>
          </div>

          <!-- Informations du profil -->
          <div class="flex-1 text-center lg:text-left">
            <h1 class="text-3xl lg:text-4xl font-bold mb-2">
              {{ isLoggedIn ? user.name : 'Chargement...' }}
            </h1>
            <p class="text-gray-400 mb-6">Membre depuis {{ formatDate(user?.created_at) }}</p>

            <!-- Statistiques -->
            <div class="flex justify-center lg:justify-start space-x-8 mb-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-orange-400">{{ followersCount ?? 0 }}</p>
                <p class="text-gray-400 text-sm">Abonnés</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-400">{{ followingCount ?? 0 }}</p>
                <p class="text-gray-400 text-sm">Abonnements</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-400">{{ books.length }}</p>
                <p class="text-gray-400 text-sm">Livres</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center">
                <Icon icon="mdi:share-variant" class="mr-2" />
                Partager le profil
              </button>
              <router-link 
                to="/settings" 
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon icon="mdi:account-edit" class="mr-2" />
                Modifier le profil
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation par onglets -->
      <div class="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-1 mb-8 border border-gray-700">
        <div class="flex space-x-1">
          <button
            @click="activeTab = 'created'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300',
              activeTab === 'created'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            ]"
          >
            <Icon icon="mdi:creation" class="mr-2 inline" />
            Créées
          </button>
          <button
            @click="activeTab = 'saved'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300',
              activeTab === 'saved'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            ]"
          >
            <Icon icon="mdi:bookmark" class="mr-2 inline" />
            Enregistrées
          </button>
        </div>
      </div>

      <!-- Bouton de création -->
      <div class="text-center mb-8">
        <button
          @click="create"
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
        >
          <Icon icon="mdi:plus-circle" class="mr-2 text-xl" />
          Créer un nouveau livre
        </button>
      </div>

      <!-- Contenu des livres -->
      <section>
        <div v-if="books.length === 0 && !isLoading" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <Icon icon="mdi:book-open-variant" class="text-6xl text-gray-500 mb-4 mx-auto" />
            <h3 class="text-xl font-semibold text-gray-300 mb-2">Aucun livre pour le moment</h3>
            <p class="text-gray-500 mb-6">Les livres que vous créez apparaîtront ici. Commencez par partager votre premier livre !</p>
            <button
              @click="create"
              class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Créer mon premier livre
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(book, index) in books"
            :key="index"
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1"
          >
            <router-link :to="`/books/${book.id}`" class="block h-full">
              <div class="relative">
                <!-- Badges -->
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

                <!-- Image du livre -->
                <img
                  :src="book.picture ? getImageUrl(book.picture) : '/default-book-cover.jpg'"
                  :alt="book.title"
                  class="w-full h-60 object-cover"
                />

                <!-- Genre -->
                <span class="absolute top-3 right-3 bg-blue-900 bg-opacity-70 text-blue-200 text-xs font-semibold px-2 py-1 rounded">
                  {{ book.genre || 'Fiction' }}
                </span>
              </div>

              <!-- Informations du livre -->
              <div class="p-4">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ book.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 line-clamp-1">{{ book.author }}</p>

                <div class="text-xs text-gray-500 mb-4">
                  <p class="line-clamp-1">Publié par <span class="font-semibold text-gray-300">{{ user.name }}</span></p>
                  <p>Le <span class="font-semibold text-gray-300">{{ formatDate(book.created_at) }}</span></p>
                  <p>Langue : <span class="font-semibold text-gray-300">{{ book.lang || 'FR' }}</span></p>
                </div>

                <!-- Statistiques -->
                <div class="flex justify-between items-center text-sm text-gray-400">
                  <div class="flex items-center">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-0.5" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-orange-500" />
                  </div>

                  <div class="flex space-x-3">
                    <span class="flex items-center">
                      <Icon icon="entypo:eye" class="mr-1 text-blue-400" />
                      1,3k
                    </span>
                    <span class="flex items-center">
                      <Icon icon="iconamoon:comment-fill" class="mr-1 text-green-400" />
                      112
                    </span>
                    <span class="flex items-center">
                      <Icon icon="ic:round-download" class="mr-1 text-purple-400" />
                      900
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Chargement et voir plus -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          <div v-for="i in 4" :key="i" class="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden animate-pulse">
            <div class="h-60 bg-gray-700"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-700 rounded"></div>
              <div class="h-3 bg-gray-700 rounded"></div>
              <div class="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div v-if="books.length > 0 && hasMore" class="text-center mt-8">
          <button
            @click="loadMoreUserBook"
            :disabled="isLoading"
            class="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {{ isLoading ? 'Chargement...' : 'Charger plus de livres' }}
          </button>
        </div>

        <div v-else-if="books.length > 0" class="text-center mt-8">
          <p class="text-gray-500">Vous avez atteint la fin de votre bibliothèque</p>
        </div>
      </section>

      <!-- Popup de création de livre -->
      <CreateBook
        :visible="popupVisible"
        @close="popupVisible = false"
      />
    </div>
  </main>
</template>

<style>
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

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
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
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 640px) {
  .profil-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}
</style>