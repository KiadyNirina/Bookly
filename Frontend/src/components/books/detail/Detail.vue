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
  <main class="min-h-screen text-white pt-24 pb-20">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <div v-if="currentBook" class="relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="sticky top-28 group">
            <div class="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                :src="getImageUrl(currentBook.picture)" 
                class="w-full h-auto aspect-[2/3] object-cover"
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
          <h1 class="text-5xl lg:text-7xl font-black mb-6 leading-tight italic tracking-tighter">
            {{ currentBook.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-white/5">
            <div class="flex items-center gap-2">
              <div class="flex text-orange-500">
                <Icon v-for="i in 5" :key="i" icon="lucide:star" class="w-4 h-4" :class="i > 4 ? 'opacity-20' : 'fill-current'"/>
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
            <a :to="`/book/${currentBook.id}/file`" 
              class="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1">
              Commencer la lecture
            </a>
            <button class="p-4 border border-white/10 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all">
              <Icon icon="lucide:bookmark" class="text-xl" />
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
              <a to="#" class="text-orange-500 font-bold text-sm hover:underline">{{ currentBook?.posted_by?.name }}</a>
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
            <h2 class="text-2xl font-black italic tracking-tighter italic">Réactions <span class="text-orange-500 text-sm not-italic ml-2">/ {{ comments.length }}</span></h2>
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
                  <p class="text-white/60 text-sm leading-relaxed mb-4 italic">{{ comment.content }}</p>
                  <div class="flex gap-4">
                    <button class="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-white/20 hover:text-orange-500 transition-colors">
                      <Icon icon="lucide:thumbs-up" /> Soutenir ({{ comment.likes }})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Découvrir aussi</p>
            <h2 class="text-4xl font-black italic tracking-tighter">Dans le même <span class="text-orange-500">style</span></h2>
          </div>
          <a to="/books" class="text-xs font-black uppercase tracking-widest border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors">Tout explorer</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="bk in similarBooks.slice(0, 4)" 
            :key="bk.id" 
            class="group relative aspect-[2/3] bg-[#1a1c26] rounded-2xl overflow-hidden border border-white/2 hover:border-orange-500 transition-all duration-500 cursor-pointer"
          >
            <a :href="`/books/${bk.id}`" class="h-full w-full block">
              <!-- Image avec effets hover -->
              <img 
                :src="getImageUrl(bk.picture)" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                :alt="bk.title"
              />
              
              <!-- Overlay dégradé -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent"></div>
              
              <!-- Badge genre en haut à droite -->
              <div class="absolute top-4 right-4">
                <span class="text-[10px] tracking-[0.2em] font-black text-white border-b border-orange-500 pb-1">
                  {{ (bk.genre || 'FICTION').toUpperCase() }}
                </span>
              </div>

              <!-- Contenu principal -->
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p class="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {{ bk.author || 'Auteur Inconnu' }}
                  </p>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-2 italic truncate">
                    {{ bk.title }}
                  </h3>
                  
                  <!-- Ligne orange animée -->
                  <div class="w-8 h-1 bg-orange-500 mb-4 transition-all duration-500 group-hover:w-full"></div>

                  <!-- Statistiques (apparaissent au hover) -->
                  <div class="flex items-center gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:eye" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">1.2k</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Icon icon="lucide:message-circle" class="text-orange-500 w-4 h-4" />
                      <span class="text-xs font-medium text-white">48</span>
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

              <!-- Badge "Populaire" (si applicable) -->
              <div 
                v-if="bk.isPopular" 
                class="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#E67E22]"
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
</style>