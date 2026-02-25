<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from "vue"
import { useRoute } from "vue-router"
import { useBook } from "@/composables/useBook"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "/pdf.worker.min.mjs?url"
import { Icon } from "@iconify/vue"

defineProps({
  id: {
    type: [String, Number],
    default: null
  }
})

// Configuration du worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const { book: currentBook, fetchBook } = useBook()

// Références DOM
const canvasRef = ref(null)
const readerRef = ref(null)
const containerRef = ref(null)

// État PDF
let pdfDoc = null
let renderTask = null
const currentPage = ref(1)
const totalPages = ref(1)
const zoomLevel = ref(1.5)

// État Session de lecture
let sessionData = ref(null)
let sessionTimer = null
let lastPageSave = ref(1)
let timeSpent = ref(0)

// Marque-pages
const bookmarks = ref([])

// Panning (déplacement à la souris)
let isPanning = false
let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0

// ============================================================================
// 🔐 AUTHENTIFICATION - Lecture directe depuis localStorage (sans modifier useAuth)
// ============================================================================
const getAuthToken = () => localStorage.getItem('token')

// ============================================================================
// 🌐 CONFIGURATION API
// ============================================================================
const getApiUrl = (endpoint) => {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000/api'
  return `${base}${endpoint}`
}

const getPdfStreamUrl = (bookId) => getApiUrl(`/books/${bookId}/stream`)

// Wrapper pour les appels API avec token automatique
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Important pour Sanctum/cookies
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }))
    throw new Error(error.message || `Erreur HTTP ${response.status}`)
  }
  
  return response.json()
}

// ============================================================================
// 📚 GESTION DES SESSIONS DE LECTURE
// ============================================================================

/**
 * Initialise ou reprend une session de lecture
 */
const initSession = async (bookId) => {
  try {
    // 1. Tenter de reprendre une session existante
    const resume = await apiRequest(getApiUrl(`/books/${bookId}/resume`), { method: 'GET' })
      .catch(() => null) // Ignorer 404 si aucune session

    console.log(resume.data , "📖 Tentative de reprise de session...")
    
    if (resume?.data?.id) {
      sessionData.value = resume.data
      
      // Restaurer la page seulement si elle est dans les limites du PDF
      if (resume.data.current_page && totalPages.value > 0) {
        const validPage = Math.min(resume.data.current_page, totalPages.value)
        if (validPage !== currentPage.value) {
          currentPage.value = validPage
          console.log(`📚 Session reprise : page ${currentPage.value}`)
        }
      }
    } else {
      // 2. Créer une nouvelle session si aucune n'existe
      const newSession = await apiRequest(getApiUrl(`/books/${bookId}/session`), { method: 'POST' })
      sessionData.value = newSession.data
      console.log(`🆕 Nouvelle session : ID ${sessionData.value.id}`)
    }
    
    // 3. Démarrer le timer de suivi (toujours)
    startSessionTimer()
    
  } catch (error) {
    console.error("⚠️ Erreur initialisation session :", error)
    // Fallback : continuer la lecture sans tracking
  }
}

/**
 * Démarre le timer de suivi du temps de lecture
 */
const startSessionTimer = () => {
  if (sessionTimer) clearInterval(sessionTimer)
  
  sessionTimer = setInterval(async () => {
    timeSpent.value++
    
    // Sauvegarder toutes les 30 secondes OU si la page a changé
    if (timeSpent.value % 30 === 0 || lastPageSave.value !== currentPage.value) {
      await saveProgress()
    }
  }, 1000)
}

/**
 * Sauvegarde la progression sur le serveur
 */
const saveProgress = async () => {
  if (!sessionData.value?.id || !pdfDoc) return
  
  try {
    const response = await apiRequest(
      getApiUrl(`/book-sessions/${sessionData.value.id}/progress`),
      {
        method: 'POST',
        body: JSON.stringify({
          current_page: currentPage.value,
          time_spent: 30,
          total_pages: totalPages.value
        })
      }
    )

    lastPageSave.value = currentPage.value

    console.log("📤 Progression envoyée au serveur...", response)
    if (response?.data) {
      sessionData.value = {
        ...sessionData.value,
        ...response.data,
        progress_percentage: response.data.progress_percentage ?? sessionData.value.progress_percentage
      }
    }
    
    // ✅ Feedback si une vue vient d'être comptabilisée
    if (response?.view_counted) {
      console.log('👁️ Vue comptabilisée !')
      showViewCountedToast()
    }
    
    console.log(`💾 Progression sauvegardée : page ${currentPage.value}`)
  } catch (error) {
    console.error("⚠️ Erreur sauvegarde progression :", error)
  }
}

const viewCountedToast = ref(false)
const isViewCounted = computed(() => sessionData.value?.view_counted === true)

const showViewCountedToast = () => {
  viewCountedToast.value = true
  // Auto-hide après 3 secondes
  setTimeout(() => {
    viewCountedToast.value = false
  }, 3000)
}

/**
 * Finalise la session avant départ (sauvegarde finale)
 */
const finalizeSession = async () => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
    sessionTimer = null
  }
  if (timeSpent.value > 0) {
    await saveProgress()
  }
  console.log(`✅ Session terminée : ${timeSpent.value}s, page ${currentPage.value}`)
}

// ============================================================================
// 📄 CHARGEMENT ET RENDU PDF
// ============================================================================

const loadPdf = async (url) => {
  try {
    const token = getAuthToken()
    
    const loadingTask = pdfjsLib.getDocument({
      url,
      httpHeaders: token ? { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
      } : {},
      withCredentials: true
    })
    
    pdfDoc = await loadingTask.promise
    totalPages.value = pdfDoc.numPages
    
    // Initialiser la session APRÈS le chargement du PDF
    await initSession(route.params.id)
    
    await renderPage(currentPage.value)
  } catch (error) {
    console.error("❌ Erreur chargement PDF :", error)
  }
}

const renderPage = async (pageNumber) => {
  if (!pdfDoc || !canvasRef.value) return
  
  // Annuler un rendu en cours
  if (renderTask) {
    renderTask.cancel()
  }
  
  try {
    const page = await pdfDoc.getPage(pageNumber)
    const viewport = page.getViewport({ scale: zoomLevel.value })
    const canvas = canvasRef.value
    const context = canvas.getContext("2d")

    // Ajuster la taille du canvas
    canvas.height = viewport.height
    canvas.width = viewport.width

    // Lancer le rendu
    renderTask = page.render({
      canvasContext: context,
      viewport: viewport
    })
    
    await renderTask.promise
    renderTask = null
    
    // Sauvegarde immédiate si changement de page significatif
    if (Math.abs(pageNumber - lastPageSave.value) >= 2) {
      await saveProgress()
    }
  } catch (error) {
    if (error.name !== 'RenderingCancelled') {
      console.error("❌ Erreur rendu page :", error)
    }
  }
}

// ============================================================================
// 🎮 CONTRÔLES DE NAVIGATION
// ============================================================================

const prevPage = () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  renderPage(currentPage.value)
}

const nextPage = () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  renderPage(currentPage.value)
}

const goToPage = (page) => {
  const target = Math.max(1, Math.min(page, totalPages.value))
  currentPage.value = target
  renderPage(target)
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 5)
  renderPage(currentPage.value)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5)
  renderPage(currentPage.value)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    readerRef.value?.requestFullscreen?.().catch((err) => {
      console.error("Erreur fullscreen :", err)
    })
  } else {
    document.exitFullscreen?.()
  }
}

// ============================================================================
// 🔖 MARQUE-PAGES
// ============================================================================

const addBookmark = () => {
  if (!bookmarks.value.includes(currentPage.value)) {
    bookmarks.value.push(currentPage.value)
    bookmarks.value.sort((a, b) => a - b)
  }
}

const goToBookmark = (page) => goToPage(page)

const removeBookmark = (page) => {
  bookmarks.value = bookmarks.value.filter(p => p !== page)
}

// ============================================================================
// 🖱️ GESTION DES ÉVÉNEMENTS SOURIS / WHEEL
// ============================================================================

const handleWheelZoom = (event) => {
  // Zoom uniquement avec Ctrl/Cmd + molette
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  const delta = event.deltaY < 0 ? 0.1 : -0.1
  zoomLevel.value = Math.min(Math.max(zoomLevel.value + delta, 0.5), 5)
  renderPage(currentPage.value)
}

const handleMouseDown = (event) => {
  if (event.button !== 0 || !containerRef.value) return // Clic gauche uniquement
  isPanning = true
  startX = event.pageX - containerRef.value.offsetLeft
  startY = event.pageY - containerRef.value.offsetTop
  scrollLeft = containerRef.value.scrollLeft
  scrollTop = containerRef.value.scrollTop
  containerRef.value.style.cursor = "grabbing"
  event.preventDefault()
}

const handleMouseMove = (event) => {
  if (!isPanning || !containerRef.value) return
  event.preventDefault()
  const x = event.pageX - containerRef.value.offsetLeft
  const y = event.pageY - containerRef.value.offsetTop
  const walkX = x - startX
  const walkY = y - startY
  containerRef.value.scrollLeft = scrollLeft - walkX
  containerRef.value.scrollTop = scrollTop - walkY
}

const handleMouseUp = () => {
  isPanning = false
  if (containerRef.value) {
    containerRef.value.style.cursor = "grab"
  }
}

const setupEventListeners = () => {
  const canvas = canvasRef.value
  const container = containerRef.value
  
  if (canvas) {
    canvas.addEventListener("wheel", handleWheelZoom, { passive: false })
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)
    canvas.addEventListener("contextmenu", (e) => e.preventDefault())
  }
  if (container) {
    container.style.cursor = "grab"
  }
}

const cleanupEventListeners = () => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener("wheel", handleWheelZoom)
    canvas.removeEventListener("mousedown", handleMouseDown)
    canvas.removeEventListener("mousemove", handleMouseMove)
    canvas.removeEventListener("mouseup", handleMouseUp)
    canvas.removeEventListener("mouseleave", handleMouseUp)
    canvas.removeEventListener("contextmenu", (e) => e.preventDefault())
  }
}

// ============================================================================
// 🔄 CYCLE DE VIE DU COMPOSANT
// ============================================================================

onMounted(async () => {
  await fetchBook(route.params.id)
})

watch(currentBook, async (newBook) => {
  if (newBook?.id) {
    // Réinitialisation complète pour un nouveau livre
    bookmarks.value = []
    currentPage.value = 1
    totalPages.value = 1
    sessionData.value = null
    timeSpent.value = 0
    lastPageSave.value = 1
    
    await nextTick()
    setupEventListeners()
    
    await loadPdf(getPdfStreamUrl(newBook.id))
  }
})

onUnmounted(() => {
  cleanupEventListeners()
  finalizeSession() // Sauvegarde finale obligatoire
  
  if (renderTask) {
    renderTask.cancel()
  }
  if (pdfDoc) {
    pdfDoc.destroy()
    pdfDoc = null
  }
  if (sessionTimer) {
    clearInterval(sessionTimer)
  }
})
</script>

<template>
  <section 
    ref="readerRef" 
    class="min-h-screen py-12 px-4 md:px-8 mt-16 selection:bg-orange-500/30"
  >
    <div class="max-w-7xl mx-auto">
      
      <!-- En-tête : Infos du livre + Progression -->
      <div class="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Lecture en cours
          </span>
          <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter leading-none text-white">
            {{ currentBook?.title || "Chargement..." }}
          </h1>
          <div class="flex items-center gap-3 mt-4">
            <span class="h-[1px] w-6 bg-orange-500"></span>
            <p class="text-xs font-bold text-white/40 uppercase tracking-widest italic">
              Par {{ currentBook?.author || "..." }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 rounded-sm">
           <span class="text-[10px] font-black uppercase tracking-widest text-white/20">Progression</span>
           <span class="text-sm font-black italic text-orange-500">
             {{ currentPage }} <span class="text-white/20 mx-1">/</span> {{ totalPages }}
           </span>
           <!-- Badge "Vue comptée" -->
  <span 
    v-if="isViewCounted" 
    class="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded-full"
  >
    <Icon icon="lucide:check" class="w-3 h-3" />
    Vu
  </span>
           <!-- Barre de progression session -->
           <div v-if="sessionData" class="w-20 h-1 bg-white/10 rounded-full overflow-hidden ml-4">
             <div 
               class="h-full bg-orange-500 transition-all duration-300"
               :style="{ width: `${sessionData?.progress_percentage || 0}%` }"
             ></div>
           </div>
        </div>
      </div>

      <!-- Barre d'outils sticky -->
      <div class="sticky top-24 z-30 mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4 p-2 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
          
          <!-- Navigation pages -->
          <div class="flex items-center bg-white/5 p-1">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1" 
              class="p-3 text-white hover:text-orange-500 disabled:opacity-20 transition-colors"
              title="Page précédente"
            >
              <Icon icon="lucide:chevron-left" class="text-xl" />
            </button>
            <div class="w-[1px] h-4 bg-white/10"></div>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages" 
              class="p-3 text-white hover:text-orange-500 disabled:opacity-20 transition-colors"
              title="Page suivante"
            >
              <Icon icon="lucide:chevron-right" class="text-xl" />
            </button>
          </div>

          <!-- Zoom -->
          <div class="flex items-center gap-2">
            <button @click="zoomOut" class="p-3 text-white hover:text-orange-500 transition-colors" title="Dézoomer">
              <Icon icon="lucide:zoom-out" class="text-lg" />
            </button>
            <span class="text-[10px] font-black w-12 text-center text-white/40">
              {{ Math.round(zoomLevel * 100) }}%
            </span>
            <button @click="zoomIn" class="p-3 text-white hover:text-orange-500 transition-colors" title="Zoomer">
              <Icon icon="lucide:zoom-in" class="text-lg" />
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pr-2">
            <button @click="addBookmark" title="Ajouter un marque-page" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:bookmark-plus" class="text-lg" />
            </button>
            <button @click="toggleFullscreen" title="Plein écran" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:maximize" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Zone de lecture PDF -->
      <div class="relative group">
        <div 
          ref="containerRef"
          class="pdf-container-wrapper bg-[#15171f] border border-white/5 overflow-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-orange-500/20"
          style="cursor: grab;"
        >
          <div class="flex justify-center p-4 md:p-12 min-h-[60vh]">
            <canvas ref="canvasRef" class="shadow-2xl max-w-full h-auto"></canvas>
          </div>
        </div>
        
        <!-- Tooltip panning -->
        <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div class="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <Icon icon="lucide:mouse-pointer-2" class="text-orange-500 text-xs" />
                <span class="text-[9px] font-black uppercase tracking-widest">Maintenez pour déplacer</span>
            </div>
        </div>
      </div>

      <!-- Section Marque-pages -->
      <div class="mt-16">
        <div class="flex items-center gap-4 mb-6">
            <h3 class="text-sm font-black uppercase tracking-[0.3em] text-white/30">Vos Marque-pages</h3>
            <div class="h-[1px] flex-1 bg-white/5"></div>
        </div>
        
        <div v-if="bookmarks.length > 0" class="flex flex-wrap gap-3">
          <div 
            v-for="page in bookmarks" 
            :key="page"
            class="group flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 pl-4 pr-2 py-2 transition-all cursor-pointer"
            @click="goToBookmark(page)"
          >
            <span class="text-[11px] font-black text-white group-hover:text-orange-500 transition-colors italic">
              PAGE {{ page }}
            </span>
            <button @click.stop="removeBookmark(page)" class="p-1 hover:text-red-500 transition-colors" title="Supprimer">
              <Icon icon="lucide:x" class="text-xs" />
            </button>
          </div>
        </div>
        <p v-else class="text-[10px] font-bold text-white/10 uppercase tracking-widest italic">
          Aucun marqueur pour ce volume.
        </p>
      </div>

      <!-- Stats de session (debug) -->
      <div v-if="sessionData" class="mt-8 text-center">
        <p class="text-[10px] text-white/20 uppercase tracking-widest">
          Session : {{ Math.floor(timeSpent / 60) }}m {{ timeSpent % 60 }}s • 
          Page {{ sessionData.current_page }} • 
          {{ sessionData.progress_percentage?.toFixed(0) }}% lu
        </p>
      </div>

    </div>
  </section>

  <Transition 
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div 
      v-if="viewCountedToast" 
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
    >
      <Icon icon="lucide:eye" class="text-xl" />
      <span class="text-sm font-black uppercase tracking-wider">Lecture comptabilisée ! 👁️</span>
    </div>
  </Transition>
</template>

<style scoped>
.pdf-container-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #f97316 #15171f;
  max-height: 85vh;
}

.pdf-container-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.pdf-container-wrapper::-webkit-scrollbar-track {
  background: #0b0d14;
}

.pdf-container-wrapper::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.pdf-container-wrapper::-webkit-scrollbar-thumb:hover {
  background: #f97316;
}

canvas {
  image-rendering: optimizeQuality;
  display: block;
}

/* Animation d'entrée du header */
h1 {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transition douce pour la barre de progression */
div[style*="width"] {
  transition: width 0.3s ease;
}
</style>