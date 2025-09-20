<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '@/composables/useBook'
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser'
import { useAuth } from '@/composables/useAuth'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const { user, isLoggedIn } = useUser()
const { isAuthenticated } = useAuth()

// États du livre courant
const { 
  book: currentBook, 
  isLoading: isBookLoading, 
  error: bookError, 
  fetchBook, 
  deleteBook 
} = useBook()

// États des livres similaires
const { 
  books: similarBooks, 
  isLoading: areBooksLoading, 
  hasMore: hasMoreBooks, 
  loadMore: loadMoreBooks 
} = useLoadMoreBooks(5)

// États de l'évaluation
const hoveredStar = ref(0)
const selectedRating = ref(0)
const starIcons = {
  filled: 'flowbite:star-solid',
  empty: 'flowbite:star-outline'
}

// États pour les commentaires
const commentText = ref('')
const showFullDescription = ref(false)
const isCommenting = ref(false)
const showAllComments = ref(false)

const displayedDescription = computed(() => {
  if (!currentBook.value?.description) return ''
  return showFullDescription.value 
    ? currentBook.value.description 
    : truncateText(currentBook.value.description, 400)
})

// Chargement initial
onMounted(async () => {
  await fetchBook(route.params.id)
  await loadMoreBooks()
})

// Gestion de la suppression
const handleDeleteBook = async (bookId) => {
    const success = await deleteBook(bookId)
    if (success) {
      await Swal.fire({
        title: 'Supprimé!',
        text: 'Le livre a été supprimé avec succès.',
        icon: 'success',
        confirmButtonColor: '#E67E22',
        background: '#1a202c',
        color: '#fff'
      })

      router.push('/books')
    }
}

// Gestion de l'évaluation
const handleStarHover = (star) => hoveredStar.value = star
const handleRatingSelection = (star) => {
  selectedRating.value = star
  Swal.fire({
    title: 'Merci !',
    text: `Vous avez donné une note de ${star} étoiles.`,
    icon: 'success',
    confirmButtonText: 'OK',
    background: '#1a202c',
    color: '#fff',
    confirmButtonColor: '#E67E22'
  })
}

// Gestion des commentaires
const handleCommentSubmit = () => {
  if (!commentText.value.trim()) return
  
  // Ici vous ajouteriez la logique pour envoyer le commentaire
  Swal.fire({
    title: 'Commentaire ajouté!',
    text: 'Votre avis a été publié.',
    icon: 'success',
    confirmButtonText: 'OK',
    background: '#1a202c',
    color: '#fff',
    confirmButtonColor: '#E67E22'
  })
  
  commentText.value = ''
  isCommenting.value = false
}

// Données de démonstration pour les commentaires
const comments = ref([
  {
    id: 1,
    user: 'Marie Dupont',
    avatar: '../../../../public/cover 4.jfif',
    date: '15/02/2024',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci! Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!',
    likes: 2,
    replies: []
  },
  {
    id: 2,
    user: 'Jean Martin',
    avatar: '../../../../public/cover 4.jfif',
    date: '10/02/2024',
    content: 'Un livre exceptionnel qui m\'a captivé du début à la fin. Les personnages sont bien développés et l\'intrigue est passionnante.',
    likes: 5,
    replies: []
  },
  {
    id: 3,
    user: 'Sophie Leroy',
    avatar: '../../../../public/cover 4.jfif',
    date: '08/02/2024',
    content: 'J\'ai adoré ce livre! L\'écriture est fluide et l\'histoire très originale. Je le recommande vivement à tous les amateurs de ce genre.',
    likes: 3,
    replies: []
  },
  {
    id: 4,
    user: 'Marie Dupont',
    avatar: '../../../../public/cover 4.jfif',
    date: '15/02/2024',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!',
    likes: 2,
    replies: []
  },
  {
    id: 5,
    user: 'Jean Martin',
    avatar: '../../../../public/cover 4.jfif',
    date: '10/02/2024',
    content: 'Un livre exceptionnel qui m\'a captivé du début à la fin. Les personnages sont bien développés et l\'intrigue est passionnante.',
    likes: 5,
    replies: []
  },
  {
    id: 6,
    user: 'Sophie Leroy',
    avatar: '../../../../public/cover 4.jfif',
    date: '08/02/2024',
    content: 'J\'ai adoré ce livre! L\'écriture est fluide et l\'histoire très originale. Je le recommande vivement à tous les amateurs de ce genre.',
    likes: 3,
    replies: []
  }
])

// Commentaires visibles (limités ou tous)
const visibleComments = computed(() => 
  showAllComments.value ? comments.value : comments.value.slice(0, 3)
)

// Utilitaires
const truncateText = (text = '', max = 100) => 
  text.length > max ? `${text.slice(0, max)}...` : text

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const getImageUrl = (imgPath) => 
  imgPath ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/'}${imgPath}` 
          : '/default-book-cover.jpg'

// Catégories pour le filtre
const categories = ref([
  'Romance', 'Fantaisie', 'Histoire', 'Fiction', 
  'Non fiction', 'Comédie', 'Action', 'Science-fiction'
])
</script>

<template>
  <main class="min-h-screen text-white pt-20 pb-12">
    <div class="container mx-auto px-4">
      <!-- Filtres par catégorie (mobile) -->
      <div class="lg:hidden mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex space-x-3 w-max py-2">
          <span 
            v-for="category in categories" 
            :key="category"
            class="px-4 py-2 bg-gray-800 bg-opacity-50 text-gray-300 text-sm rounded-full whitespace-nowrap"
          >
            {{ category }}
          </span>
        </div>
      </div>

      <!-- Livre principal -->
      <div v-if="currentBook" class="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 mb-12 border border-gray-900 shadow-xl">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Image du livre -->
          <div class="lg:w-2/5">
            <div class="relative">
              <img 
                :src="getImageUrl(currentBook.picture)" 
                :alt="currentBook.title" 
                class="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
              />
              <div class="absolute top-4 left-4">
                <span class="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Romance
                </span>
              </div>
            </div>
          </div>

          <!-- Informations du livre -->
          <div class="lg:w-3/5">
            <h1 class="text-3xl lg:text-4xl font-bold text-white mb-4">{{ currentBook.title }}</h1>
            <p class="text-xl text-gray-300 mb-6">Écrit par <span class="font-semibold text-orange-400">{{ currentBook.author }}</span></p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                <h3 class="text-sm font-semibold text-gray-400 mb-2">Informations</h3>
                <p class="text-white">
                  Publié par 
                  <router-link 
                    v-if="isLoggedIn && currentBook.posted_by.name == user.name" 
                    to="/profil/create"
                    class="font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {{ currentBook.posted_by.name }}
                  </router-link>
                  <router-link 
                    v-else 
                    :to="`/user/${currentBook.posted_by.id}/create`"
                    class="font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {{ currentBook.posted_by.name }}
                  </router-link>
                </p>
                <p class="text-white mt-1">Le <span class="font-semibold">{{ formatDate(currentBook.created_at) }}</span></p>
                <p class="text-white mt-1">Langue : <span class="font-semibold">{{ currentBook.lang }}</span></p>
                <p class="text-white mt-1">Pages : <span class="font-semibold">{{ currentBook.page }}</span></p>
              </div>

              <div class="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                <h3 class="text-sm font-semibold text-gray-400 mb-2">Statistiques</h3>
                <div class="flex items-center mb-2">
                  <div class="flex mr-3">
                    <Icon icon="flowbite:star-solid" class="text-orange-500 mr-1" v-for="i in 4" :key="i" />
                    <Icon icon="flowbite:star-outline" class="text-orange-500" />
                  </div>
                  <span class="text-gray-400 text-sm"><i>(100 notes)</i></span>
                </div>
                <div class="flex space-x-4 text-sm text-gray-400">
                  <span class="flex items-center">
                    <Icon icon="entypo:eye" class="mr-1" />
                    1,3k
                  </span>
                  <span class="flex items-center">
                    <Icon icon="iconamoon:comment-fill" class="mr-1" />
                    112
                  </span>
                  <span class="flex items-center">
                    <Icon icon="ic:round-download" class="mr-1" />  
                    900
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-3 mb-8">
              <router-link 
                :to="`/book/${currentBook.id}/file`"
                class="flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Icon icon="ant-design:read-filled" class="mr-2" />Lire
              </router-link>
              <button class="flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors">
                <Icon icon="stash:save-ribbon" class="mr-2" />Enregistrer
              </button>
              <button class="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                <Icon icon="ic:round-download" class="mr-2" />Télécharger
              </button>
              <button class="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                <Icon icon="mage:share-fill" class="mr-2" />Partager
              </button>
              <button 
                    v-if="isLoggedIn && currentBook.posted_by.name === user.name"
                    @click="handleDeleteBook(currentBook.id)"
                    class="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                    <Icon icon="mdi:delete" class="mr-2" /> Supprimer
                </button>
            </div>

            <!-- Évaluation -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-3">Donnez votre avis</h3>
              <div class="flex space-x-1 mb-4">
                <Icon 
                  v-for="star in 5" 
                  :key="star"
                  :icon="star <= hoveredStar || star <= selectedRating ? starIcons.filled : starIcons.empty"
                  @mouseover="handleStarHover(star)"
                  @mouseleave="handleStarHover(0)"
                  @click="handleRatingSelection(star)" 
                  class="text-3xl text-orange-500 cursor-pointer transition-transform hover:scale-110" 
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4">Description</h2>
          <div class="bg-gray-900 bg-opacity-30 rounded-xl p-6 max-h-96 overflow-y-auto custom-scrollbar">
            <p class="text-gray-300 leading-relaxed" v-html="displayedDescription.replace(/\n/g, '<br>')"></p>
            <button 
                v-if="currentBook.description.length > 400"
                @click="showFullDescription = !showFullDescription"
                class="text-blue-400 hover:text-blue-300 ml-2 text-sm"
            >
                {{ showFullDescription ? 'Lire moins' : 'Lire la suite' }}
            </button>
          </div>
        </div>

        <!-- Commentaires -->
        <div class="mt-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Commentaires ({{ comments.length }})</h2>
            <button 
              v-if="comments.length > 3"
              @click="showAllComments = !showAllComments"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {{ showAllComments ? 'Voir moins' : 'Voir tous' }}
            </button>
          </div>

          <!-- Formulaire de commentaire -->
          <div v-if="isAuthenticated" class="mb-8">
            <div class="flex items-start space-x-4">
              <img 
                src="../../../../public/cover 2.jpg" 
                alt="Profil" 
                class="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
              />
              <div class="flex-1">
                <textarea
                  v-model="commentText"
                  placeholder="Donnez votre avis..."
                  class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="isCommenting = false"
                    class="px-4 py-2 text-gray-400 hover:text-gray-300 mr-2"
                  >
                    Annuler
                  </button>
                  <button
                    @click="handleCommentSubmit"
                    :disabled="!commentText.trim()"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="mb-8 text-center py-6 bg-gray-900 bg-opacity-30 rounded-xl">
            <p class="text-gray-400">
              <router-link to="/login" class="text-blue-400 hover:text-blue-300">Connectez-vous</router-link>
              pour laisser un commentaire
            </p>
          </div>

          <!-- Liste des commentaires -->
          <div class="space-y-6">
            <div 
              v-for="comment in visibleComments" 
              :key="comment.id"
              class="bg-gray-900 bg-opacity-30 rounded-xl p-6"
            >
              <div class="flex items-start space-x-4">
                <img 
                  :src="comment.avatar" 
                  :alt="comment.user" 
                  class="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-white">{{ comment.user }}</h4>
                    <span class="text-sm text-gray-500">Le {{ comment.date }}</span>
                  </div>
                  <p class="text-gray-300 mb-4">
                    {{ comment.showFull ? comment.content : truncateText(comment.content, 200) }}
                    <button 
                        v-if="comment.content.length > 200" 
                        @click="comment.showFull = !comment.showFull"
                        class="text-blue-400 hover:text-blue-300 ml-2 text-sm"
                    >
                        {{ comment.showFull ? 'Lire moins' : 'Lire plus' }}
                    </button>
                  </p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-6">Il y a 2 mois</span>
                    <button class="flex items-center mr-6 hover:text-gray-300">
                      <Icon icon="solar:like-broken" class="mr-1" />
                      <span>{{ comment.likes }}</span>
                    </button>
                    <button class="hover:text-gray-300">Répondre</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Livres similaires -->
      <section class="mb-12">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Livres Similaires</h2>
          <router-link 
            to="/books" 
            class="text-orange-400 hover:text-orange-300 flex items-center transition-colors"
          >
            Voir plus
            <Icon icon="ic:round-arrow-forward" class="ml-2" />
          </router-link>
        </div>

        <div v-if="similarBooks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(bk, index) in similarBooks" 
            :key="index"
            v-show="bk.id !== currentBook?.id"
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20"
          >
            <a :href="`/books/${bk.id}`" class="block h-full">
              <img 
                :src="getImageUrl(bk.picture)" 
                :alt="bk.title" 
                class="w-full h-60 object-cover"
              />
              
              <div class="p-4">
                <span class="inline-block bg-blue-900 bg-opacity-50 text-blue-200 text-xs font-semibold px-2 py-1 rounded mb-3">Fiction</span>
                
                <h3 class="text-lg font-bold text-white mb-1 truncate">{{ bk.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 truncate">{{ bk.author }}</p>
                
                <div class="text-xs text-gray-500 mb-4">
                  <p class="truncate">Publié par <span class="font-semibold text-gray-300">{{ bk.posted_by.name }}</span></p>
                  <p>Le <span class="font-semibold text-gray-300">{{ bk.created_at }}</span></p>
                  <p>Lang : <span class="font-semibold text-gray-300">{{ bk.lang }}</span></p>
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
            </a>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <Icon icon="mdi:book-off" class="text-6xl text-gray-500 mx-auto mb-4" />
          <p class="text-gray-400">Aucun livre similaire trouvé</p>
        </div>

        <div v-if="hasMoreBooks" class="text-center mt-8">
          <button 
            @click="loadMoreBooks" 
            :disabled="areBooksLoading"
            class="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {{ !areBooksLoading ? 'Charger plus' : 'Chargement...' }}
          </button>
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

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>