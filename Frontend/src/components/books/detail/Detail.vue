<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '@/composables/useBook'
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser'
import { useAuth } from '@/composables/useAuth'
import { useSave } from '@/composables/useSave'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const { user, isLoggedIn } = useUser()
const { isAuthenticated } = useAuth()

const { saveBook, checkIfSaved, unsaveBook, isLoading: isSaving, error: saveError, success: saveSuccess } = useSave()

const isBookSaved = ref(false)
const savedBookId = ref(null)

const checkSavedStatus = async (bookId) => {
  if (!user.value?.id) return
  
  try {
    const result = await checkIfSaved(bookId, user.value.id)
    isBookSaved.value = result.saved
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
  }
}

const handleSaveBook = async (bookId) => {
  if (!isAuthenticated.value) {
    const result = await Swal.fire({
      title: 'Non connecté',
      text: 'Vous devez être connecté pour sauvegarder un livre.',
      icon: 'warning',
      confirmButtonColor: '#E67E22',
      background: '#1a202c',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: 'Se connecter',
      cancelButtonText: 'Annuler'
    })
    
    if (result.isConfirmed) {
      router.push('/login')
    }
    return
  }

  try {
    if (isBookSaved.value) {
      const result = await Swal.fire({
        title: 'Déjà dans votre bibliothèque',
        text: 'Ce livre est déjà dans votre bibliothèque. Voulez-vous le retirer ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#E67E22',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Oui, retirer',
        cancelButtonText: 'Annuler',
        background: '#1a202c',
        color: '#fff'
      })

      if (result.isConfirmed) {
        await unsaveBook(bookId)
        isBookSaved.value = false
        
        await Swal.fire({
          title: 'Retiré !',
          text: 'Le livre a été retiré de votre bibliothèque.',
          icon: 'success',
          confirmButtonColor: '#E67E22',
          background: '#1a202c',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        })
      }

      return
    } else {
      const savedBook = await saveBook(bookId)
        
      if (savedBook) {
        isBookSaved.value = true
        
        await Swal.fire({
          title: 'Succès !',
          text: 'Le livre a été ajouté à votre bibliothèque.',
          icon: 'success',
          confirmButtonColor: '#E67E22',
          background: '#1a202c',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        })
      }
    }
  } catch (err) {
    // Gestion détaillée de l'erreur
    let errorMessage = 'Impossible d\'ajouter le livre à votre bibliothèque.'
    
    if (saveError.value) {
      errorMessage = saveError.value
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    
    await Swal.fire({
      title: 'Erreur',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#E67E22',
      background: '#1a202c',
      color: '#fff'
    })
  }
}

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
  try {
    await fetchBook(route.params.id)
    if (currentBook.value?.id) {
      await checkSavedStatus(currentBook.value.id)
    }
    await loadMoreBooks()
  } catch (error) {
    console.error('Erreur chargement:', error)
  }
})

// Surveiller les changements de livre
watch(() => currentBook.value?.id, async (newId) => {
  if (newId) {
    await checkSavedStatus(newId)
  }
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
  <main class="min-h-screen text-white pt-24 pb-20">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <div v-if="isSaving" class="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Icon icon="lucide:loader-2" class="animate-spin text-xl" />
        <span class="text-sm font-bold">Sauvegarde en cours...</span>
      </div>
      
      <div v-if="currentBook" class="relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="sticky top-28 group">
            <div class="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                :src="getImageUrl(currentBook.picture)" 
                class="w-full h-auto aspect-[2/3] object-cover"
                :alt="currentBook.title"
              />
              <div class="absolute top-6 left-6">
                <span class="bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                  Romance
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
          <p class="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">Chef-d'œuvre de {{ currentBook.author }}</p>
          <h1 class="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tighter">
            {{ currentBook.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-white/5">
            <div class="flex items-center gap-2">
              <div class="flex text-orange-500">
                <Icon v-for="i in 5" :key="i" :icon="i > 4 ? 'flowbite:star-outline' : 'flowbite:star-solid'" class="w-4 h-4"/>
              </div>
              <span class="text-sm font-bold">(4.8/5)</span>
            </div>
            <div v-for="stat in [{i:'lucide:eye', v:'1.3k'}, {i:'lucide:message-square', v:'112'}, {i:'lucide:download', v:'900'}]" :key="stat.v" class="flex items-center gap-2 text-white/40">
              <Icon :icon="stat.i" class="w-4 h-4" />
              <span class="text-xs font-bold">{{ stat.v }}</span>
            </div>
          </div>

          <div class="mb-10">
            <h3 class="text-white/30 uppercase tracking-widest text-[10px] font-black mb-4">Synopsis</h3>
            <p class="text-lg text-white/70 leading-relaxed max-w-2xl font-light">
              {{ displayedDescription }}
              <button @click="showFullDescription = !showFullDescription" class="text-orange-500 font-bold ml-2 hover:underline">
                {{ showFullDescription ? 'Réduire' : 'Lire la suite' }}
              </button>
            </p>
          </div>

          <div class="flex flex-wrap gap-4 items-center">
            <a :href="`/book/${currentBook.id}/file`" 
              class="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1">
              Commencer la lecture
            </a>
            <button 
              @click="handleSaveBook(currentBook.id)"
              class="p-4 border border-white/10 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :title="isBookSaved ? 'Déjà dans votre bibliothèque' : 'Ajouter à ma bibliothèque'"
            >
              <Icon 
                :icon="isSaving ? 'lucide:loader-2' : (isBookSaved ? 'lucide:check' : 'lucide:bookmark')" 
                :class="['text-xl', { 'animate-spin': isSaving }]" 
              />
            </button>
            <button class="p-4 border border-white/10 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all">
              <Icon icon="lucide:download" class="text-xl" />
            </button>
            <button class="p-4 border border-white/10 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all">
              <Icon icon="lucide:share-2" class="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="saveError" class="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
        {{ saveError }}
      </div>

      <div v-if="saveSuccess" class="mb-8 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-500">
        {{ saveSuccess }}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
        
        <div class="space-y-8">
          <h2 class="text-xl font-bold border-l-4 border-orange-500 pl-4 uppercase tracking-tighter">Fiche Technique</h2>
          <div class="space-y-4">
            <div v-for="info in [['Pages', currentBook?.page], ['Langue', currentBook?.lang], ['Date', formatDate(currentBook?.created_at)]]" 
              :key="info[0]" class="flex justify-between py-3 border-b border-white/5">
              <span class="text-white/40 text-sm">{{ info[0] }}</span>
              <span class="font-bold text-sm">{{ info[1] }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-white/5">
              <span class="text-white/40 text-sm">Publié par</span>
              <a href="#" class="text-orange-500 font-bold text-sm hover:underline">{{ currentBook?.posted_by?.name }}</a>
            </div>
          </div>

          <div class="bg-white/5 rounded-3xl p-8 text-center border border-white/10">
            <h4 class="font-bold mb-4 uppercase tracking-widest text-[10px]">Notez cet ouvrage</h4>
            <div class="flex justify-center gap-2">
              <Icon 
                v-for="star in 5" :key="star"
                :icon="star <= (hoveredStar || selectedRating) ? 'flowbite:star-solid' : 'lucide:star'"
                :class="['text-2xl cursor-pointer transition-all', star <= (hoveredStar || selectedRating) ? 'text-orange-500 fill-current' : 'text-white/10']"
                @mouseover="hoveredStar = star"
                @mouseleave="hoveredStar = 0"
                @click="handleRatingSelection(star)"
              />
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-10">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-black tracking-tighter">Réactions <span class="text-orange-500 text-sm not-italic ml-2">/ {{ comments.length }}</span></h2>
            <button v-if="isAuthenticated" @click="isCommenting = true" class="text-xs font-black uppercase tracking-widest text-orange-500 hover:text-white transition-colors">Écrire un avis</button>
          </div>

           <!-- FORMULAIRE D'AVIS -->
          <div v-if="isCommenting" class="bg-white/[0.02] border border-orange-500 rounded-3xl p-6 transition-all duration-300 animate-fade-in-up">
            <div class="flex gap-4 mb-4">
              <div class="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span class="text-orange-400 font-bold text-lg">
                  {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
                </span>
              </div>
              <div class="flex-1">
                <textarea
                  v-model="commentText"
                  placeholder="Partagez votre avis sur ce livre..."
                  class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none transition-all min-h-[100px] resize-y"
                  @keydown.ctrl.enter.prevent="handleCommentSubmit"
                  @keydown.meta.enter.prevent="handleCommentSubmit"
                ></textarea>
                
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <div class="flex gap-2">
                    <button 
                      @click="isCommenting = false"
                      class="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                    <div class="flex items-center gap-1 text-[10px] text-white/40">
                      <Icon icon="lucide:info" class="w-3 h-3" />
                      <span>Appuyez sur Ctrl + Entrée pour publier</span>
                    </div>
                  </div>
                  <button
                    @click="handleCommentSubmit"
                    :disabled="!commentText.trim()"
                    class="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Icon icon="lucide:send" class="w-3 h-3" />
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="comment in visibleComments" :key="comment.id" 
              class="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl p-6 transition-all">
              <div class="flex gap-4">
                <img :src="comment.avatar" class="w-12 h-12 rounded-full border border-orange-500 p-0.5" />
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-sm">{{ comment.user }}</h4>
                    <span class="text-[10px] text-white/30 uppercase font-black">{{ comment.date }}</span>
                  </div>
                  <p class="text-white/60 text-sm leading-relaxed mb-4">{{ comment.content }}</p>
                  <div class="flex gap-4">
                    <button class="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-white/20 hover:text-orange-500 transition-colors">
                      <Icon icon="lucide:thumbs-up" /> Soutenir ({{ comment.likes }})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BOUTON AFFICHER PLUS/MOINS -->
          <div v-if="comments.length > 3" class="text-center pt-4">
            <button
              @click="showAllComments = !showAllComments"
              class="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-orange-500 hover:text-white hover:bg-orange-500 transition-all duration-300"
            >
              <template v-if="!showAllComments">
                <span>Afficher plus</span>
                <Icon icon="lucide:chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180" />
              </template>
              <template v-else>
                <span>Afficher moins</span>
                <Icon icon="lucide:chevron-up" class="w-4 h-4 transition-transform group-hover:rotate-180" />
              </template>
            </button>
          </div>
        </div>
      </div>

      <section>
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Découvrir aussi</p>
            <h2 class="text-4xl font-black tracking-tighter">Dans le même <span class="text-orange-500">style</span></h2>
          </div>
          <a href="/books/recent" class="text-xs font-black uppercase tracking-widest border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors">Tout explorer</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="bk in similarBooks.slice(0, 4)" 
            :key="bk.id" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <a :href="`/books/${bk.id}`" class="h-full w-full block">

              <img 
                :src="getImageUrl(bk.picture)" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-40"
                :alt="bk.title"
                loading="lazy"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <div class="absolute top-4 right-4 z-10">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (bk.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <div class="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ bk.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ bk.title }}
                  </h3>

                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover:w-full"></div>

                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:eye" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ bk.views || '1.2k' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">{{ bk.comments_count || '48' }}</span>
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
                v-if="bk.is_popular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22] z-10"
              ></div>
            </a>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

.container {
  animation: fadeIn 0.8s ease-out;
}
</style>