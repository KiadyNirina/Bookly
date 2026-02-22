<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue"
import { useRoute } from "vue-router"
import { useBook } from "@/composables/useBook"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "/pdf.worker.min.mjs?url"
import { Icon } from "@iconify/vue"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const { book: currentBook, fetchBook } = useBook()
const canvasRef = ref(null)
const readerRef = ref(null)

let pdfDoc = null
let renderTask = null // Pour annuler un rendu en cours
const currentPage = ref(1)
const totalPages = ref(1)
const zoomLevel = ref(1.5)
const bookmarks = ref([])

// Panning
let isPanning = false
let startX = 0
let startY = 0
let scrollLeft = 0
let scrollTop = 0
const containerRef = ref(null)

const getPdfUrl = (bookId) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000/api'
  return `${baseUrl}/books/${bookId}/file`
}

onMounted(async () => {
  await fetchBook(route.params.id)
})

watch(currentBook, async (newBook) => {
  if (newBook?.id) {
    // Réinitialisation
    bookmarks.value = []
    currentPage.value = 1
    await loadPdf(getPdfUrl(newBook.id))
  }
})

const loadPdf = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument({
      url,
      // Si votre API nécessite un token d'authentification :
      // httpHeaders: { 'Authorization': `Bearer ${token}` },
      // withCredentials: true
    })
    pdfDoc = await loadingTask.promise
    totalPages.value = pdfDoc.numPages
    await renderPage(currentPage.value)
  } catch (error) {
    console.error("Erreur chargement PDF :", error)
  }
}

const renderPage = async (pageNumber) => {
  if (!pdfDoc || !canvasRef.value) return
  
  // Annuler le rendu précédent si en cours
  if (renderTask) {
    renderTask.cancel()
  }
  
  try {
    const page = await pdfDoc.getPage(pageNumber)
    const viewport = page.getViewport({ scale: zoomLevel.value })
    const canvas = canvasRef.value
    const context = canvas.getContext("2d")

    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }
    
    renderTask = page.render(renderContext)
    await renderTask.promise
    renderTask = null
  } catch (error) {
    if (error.name !== 'RenderingCancelled') {
      console.error("Erreur rendu page :", error)
    }
  }
}

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

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 5) // Limite max
  renderPage(currentPage.value)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5) // Limite min
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

// Marqueurs
const addBookmark = () => {
  if (!bookmarks.value.includes(currentPage.value)) {
    bookmarks.value.push(currentPage.value)
    bookmarks.value.sort((a, b) => a - b)
  }
}

const goToBookmark = (page) => {
  currentPage.value = page
  renderPage(currentPage.value)
}

const removeBookmark = (page) => {
  bookmarks.value = bookmarks.value.filter(p => p !== page)
}

// Zoom avec molette
const handleWheelZoom = (event) => {
  if (!event.ctrlKey && !event.metaKey) return // zoom uniquement avec Ctrl
  event.preventDefault()
  const delta = event.deltaY < 0 ? 0.1 : -0.1
  zoomLevel.value = Math.min(Math.max(zoomLevel.value + delta, 0.5), 5)
  renderPage(currentPage.value)
}

// ✅ Panning - utilisation de containerRef
const handleMouseDown = (event) => {
  if (event.button !== 0 || !containerRef.value) return
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

// ✅ Gestion centralisée des listeners
const setupEventListeners = () => {
  const canvas = canvasRef.value
  const container = containerRef.value
  
  if (canvas) {
    canvas.addEventListener("wheel", handleWheelZoom, { passive: false })
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)
    canvas.addEventListener("contextmenu", (e) => e.preventDefault()) // Désactiver menu clic droit
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

onMounted(() => {
  nextTick(() => {
    setupEventListeners()
  })
})

onUnmounted(() => {
  cleanupEventListeners()
  if (renderTask) {
    renderTask.cancel()
  }
  if (pdfDoc) {
    pdfDoc.destroy()
    pdfDoc = null
  }
})
</script>

<template>
  <section ref="readerRef" class="min-h-screen py-12 px-4 md:px-8 mt-16 selection:bg-orange-500/30">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">Lecture en cours</span>
          <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter leading-none text-white">
            {{ currentBook?.title || "Chargement..." }}
          </h1>
          <div class="flex items-center gap-3 mt-4">
            <span class="h-[1px] w-6 bg-orange-500"></span>
            <p class="text-xs font-bold text-white/40 uppercase tracking-widest italic">Par {{ currentBook?.author || "..." }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 rounded-sm">
           <span class="text-[10px] font-black uppercase tracking-widest text-white/20">Progression</span>
           <span class="text-sm font-black italic text-orange-500">{{ currentPage }} <span class="text-white/20 mx-1">/</span> {{ totalPages }}</span>
        </div>
      </div>

      <div class="sticky top-24 z-30 mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4 p-2 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
          <div class="flex items-center bg-white/5 p-1">
            <button @click="prevPage" :disabled="currentPage === 1" class="p-3 text-white hover:text-orange-500 disabled:opacity-20 transition-colors">
              <Icon icon="lucide:chevron-left" class="text-xl" />
            </button>
            <div class="w-[1px] h-4 bg-white/10"></div>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="p-3 text-white hover:text-orange-500 disabled:opacity-20 transition-colors">
              <Icon icon="lucide:chevron-right" class="text-xl" />
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button @click="zoomOut" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:zoom-out" class="text-lg" />
            </button>
            <span class="text-[10px] font-black w-12 text-center text-white/40">{{ Math.round(zoomLevel * 100) }}%</span>
            <button @click="zoomIn" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:zoom-in" class="text-lg" />
            </button>
          </div>

          <div class="flex items-center gap-2 pr-2">
            <button @click="addBookmark" title="Marque-page" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:bookmark-plus" class="text-lg" />
            </button>
            <button @click="toggleFullscreen" title="Plein écran" class="p-3 text-white hover:text-orange-500 transition-colors">
              <Icon icon="lucide:maximize" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div class="relative group">
        <div 
          class="pdf-container-wrapper bg-[#15171f] border border-white/5 overflow-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-orange-500/20"
          style="cursor: grab;"
        >
          <div class="flex justify-center p-4 md:p-12">
            <canvas ref="canvasRef" class="shadow-2xl max-w-full h-auto"></canvas>
          </div>
        </div>
        
        <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div class="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <Icon icon="lucide:mouse-pointer-2" class="text-orange-500 text-xs" />
                <span class="text-[9px] font-black uppercase tracking-widest">Maintenez pour déplacer</span>
            </div>
        </div>
      </div>

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
            <span class="text-[11px] font-black text-white group text-white-hover:text-orange-500 transition-colors italic">PAGE {{ page }}</span>
            <button @click.stop="removeBookmark(page)" class="p-1 hover:text-red-500 transition-colors">
              <Icon icon="lucide:x" class="text-xs" />
            </button>
          </div>
        </div>
        <p v-else class="text-[10px] font-bold text-white/10 uppercase tracking-widest italic">Aucun marqueur pour ce volume.</p>
      </div>
    </div>
  </section>
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
}

.pdf-container-wrapper::-webkit-scrollbar-thumb:hover {
  background: #f97316;
}

canvas {
  image-rendering: high-quality;
}

/* Animation de l'entrée du header */
h1 {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>