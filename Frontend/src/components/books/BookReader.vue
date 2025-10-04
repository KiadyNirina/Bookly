<script setup>
import { ref, onMounted, watch } from "vue"
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
  if (zoomLevel.value <= 0.5) return
  zoomLevel.value -= 0.2
  renderPage(currentPage.value)
}

// Fullscreen
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    readerRef.value.requestFullscreen().catch((err) => {
      console.error("Erreur fullscreen :", err)
    })
  } else {
    document.exitFullscreen()
  }
}
</script>

<template class="pt-20">
  <section ref="readerRef" class="mx-auto my-20 pdf-reader">
    <div class="pdf-header">
      <h2>{{ currentBook?.title || "Chargement du livre..." }}</h2>
      <span class="book-author">Par {{ currentBook?.author || "..." }}</span>
    </div>

    <!-- Barre de navigation -->
    <div class="pdf-controls">
      <button @click="prevPage" :disabled="currentPage === 1">⬅ Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant ➡</button>

      <button @click="zoomOut">➖ Zoom</button>
      <button @click="zoomIn">➕ Zoom</button>

      <button @click="toggleFullscreen">⛶ Fullscreen</button>
    </div>

    <div class="pdf-container">
      <canvas ref="canvasRef"></canvas>
    </div>

    <div class="pdf-footer">
      <span>📄 Page {{ currentPage }} / {{ totalPages }}</span>
    </div>
  </section>
</template>

<style scoped>
.pdf-reader {
  max-width: 900px;
  background: #1e1e2f;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.pdf-header {
  text-align: center;
  margin-bottom: 20px;
}

.pdf-header h2 {
  font-size: 1.8rem;
  color: #f0f0f0;
  margin: 0;
}

.book-author {
  display: block;
  font-size: 1rem;
  color: #bbb;
  margin-top: 4px;
}

.pdf-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.pdf-controls button {
  padding: 6px 12px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.pdf-controls button:hover {
  background: #555;
}

.pdf-controls span {
  line-height: 2.5;
  color: white;
}

.pdf-container {
  display: flex;
  justify-content: center;
  background: #2a2a3d;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
}

canvas {
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.pdf-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 0.9rem;
  color: #ccc;
}
</style>
