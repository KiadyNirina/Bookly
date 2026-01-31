<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import { useBook } from "@/composables/useBook"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const { book: currentBook, fetchBook } = useBook()
const canvasRef = ref(null)
const readerRef = ref(null)

let pdfDoc = null
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

onMounted(async () => {
  await fetchBook(route.params.id)
})

watch(currentBook, async (newBook) => {
  if (newBook && newBook.file) {
    await loadPdf(getPdfUrl(newBook.file))
  }
})

const getPdfUrl = (filePath) =>
  filePath.startsWith("http")
    ? filePath
    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/storage/"}${filePath}`

const loadPdf = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    pdfDoc = await loadingTask.promise
    totalPages.value = pdfDoc.numPages
    renderPage(currentPage.value)
  } catch (error) {
    console.error("Erreur chargement PDF :", error)
  }
}

const renderPage = async (pageNumber) => {
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
  page.render(renderContext)
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
  zoomLevel.value += 0.2
  renderPage(currentPage.value)
}

const zoomOut = () => {
  if (zoomLevel.value <= 0.2) return
  zoomLevel.value -= 0.2
  renderPage(currentPage.value)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    readerRef.value.requestFullscreen().catch((err) => {
      console.error("Erreur fullscreen :", err)
    })
  } else {
    document.exitFullscreen()
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
  event.preventDefault()
  if (event.deltaY < 0) zoomLevel.value += 0.1
  else if (zoomLevel.value > 0.2) zoomLevel.value -= 0.1
  renderPage(currentPage.value)
}

// Panning avec clic gauche
const handleMouseDown = (event) => {
  if (event.button !== 0) return
  isPanning = true
  startX = event.pageX - canvasRef.value.parentElement.offsetLeft
  startY = event.pageY - canvasRef.value.parentElement.offsetTop
  scrollLeft = canvasRef.value.parentElement.scrollLeft
  scrollTop = canvasRef.value.parentElement.scrollTop
  canvasRef.value.parentElement.style.cursor = "grabbing"
}

const handleMouseMove = (event) => {
  if (!isPanning) return
  event.preventDefault()
  const x = event.pageX - canvasRef.value.parentElement.offsetLeft
  const y = event.pageY - canvasRef.value.parentElement.offsetTop
  const walkX = (x - startX)
  const walkY = (y - startY)
  canvasRef.value.parentElement.scrollLeft = scrollLeft - walkX
  canvasRef.value.parentElement.scrollTop = scrollTop - walkY
}

const handleMouseUp = () => {
  isPanning = false
  canvasRef.value.parentElement.style.cursor = "grab"
}

onMounted(() => {
  canvasRef.value?.addEventListener("wheel", handleWheelZoom, { passive: false })
  canvasRef.value?.addEventListener("mousedown", handleMouseDown)
  canvasRef.value?.addEventListener("mousemove", handleMouseMove)
  canvasRef.value?.addEventListener("mouseup", handleMouseUp)
  canvasRef.value?.addEventListener("mouseleave", handleMouseUp)
})

onUnmounted(() => {
  canvasRef.value?.removeEventListener("wheel", handleWheelZoom)
  canvasRef.value?.removeEventListener("mousedown", handleMouseDown)
  canvasRef.value?.removeEventListener("mousemove", handleMouseMove)
  canvasRef.value?.removeEventListener("mouseup", handleMouseUp)
  canvasRef.value?.removeEventListener("mouseleave", handleMouseUp)
})
</script>

<template>
  <section ref="readerRef" class="min-h-screen py-8 px-4 mt-20">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2 px-4">{{ currentBook?.title || "Chargement du livre..." }}</h1>
        <p class="text-slate-300 text-base md:text-lg px-4">Par {{ currentBook?.author || "..." }}</p>
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-black/20 rounded-xl">
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn">⬅ Précédent</button>
          <span class="text-white">Page {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="btn">Suivant ➡</button>
        </div>

        <div class="flex items-center gap-2">
          <button @click="zoomOut" class="btn">➖ Zoom</button>
          <span class="text-white">{{ Math.round(zoomLevel * 100) }}%</span>
          <button @click="zoomIn" class="btn">➕ Zoom</button>
        </div>

        <div class="flex items-center gap-2">
          <button @click="toggleFullscreen" class="btn">Fullscreen</button>
          <button @click="addBookmark" class="btn">Marque-page</button>
        </div>
      </div>

      <!-- PDF Container -->
      <div class="pdf-container" style="overflow: auto; cursor: grab;">
        <canvas ref="canvasRef"></canvas>
      </div>

      <!-- Bookmarks -->
      <div class="bookmarks mt-4">
        <h3 class="text-white mb-2">Marqueurs :</h3>
        <div v-if="bookmarks.length > 0" class="flex flex-wrap gap-2">
          <button v-for="page in bookmarks" :key="page" @click="goToBookmark(page)" class="btn-sm">
            Page {{ page }} ✨
            <span @click.stop="removeBookmark(page)" class="ml-1 text-red-500 cursor-pointer">❌</span>
          </button>
        </div>
        <p v-else class="text-white">Aucun marqueur ajouté.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pdf-container {
  display: flex;
  justify-content: center;
  background: #2a2a3d;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  max-width: 100%;
}
canvas {
  display: block;
  border-radius: 8px;
}
.btn {
  padding: 6px 12px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn:hover {
  background: #555;
}
.btn-sm {
  padding: 4px 8px;
  background: #444;
  color: white;
  border-radius: 5px;
  font-size: 0.8rem;
}
.btn-sm:hover {
  background: #666;
}
.pdf-container {
  cursor: grab;
}
.pdf-container:active {
  cursor: grabbing;
}
</style>
