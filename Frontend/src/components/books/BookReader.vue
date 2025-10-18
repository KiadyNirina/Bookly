<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '@/composables/useBook'

const route = useRoute()
const router = useRouter()
const { book: currentBook, fetchBook } = useBook()

const pdfUrl = ref('')

onMounted(async () => {
  await fetchBook(route.params.id)
  if (currentBook.value?.file) {
    pdfUrl.value = `${
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/storage/'
    }${currentBook.value.file}`
  }
})
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-white pt-20 pb-8">
    <div class="container mx-auto px-4">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg">
        <div>
          <h1 class="text-2xl font-bold text-orange-400">{{ currentBook?.title }}</h1>
          <p class="text-gray-300">par {{ currentBook?.author }}</p>
        </div>
        
        <button 
          @click="router.back()"
          class="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Icon icon="mdi:arrow-left" class="mr-2" />
          Retour
        </button>
      </div>

      <!-- PDF dans iframe -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Lecture du PDF</h2>
          <a 
            :href="pdfUrl" 
            target="_blank"
            class="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            download
          >
            <Icon icon="mdi:download" class="mr-2" />
            Télécharger
          </a>
        </div>
        
        <div class="bg-black rounded-lg overflow-hidden">
          <iframe 
            :src="pdfUrl" 
            class="w-full h-[80vh]"
            frameborder="0"
          >
            <p class="text-white p-4">
              Votre navigateur ne supporte pas les iframes. 
              <a :href="pdfUrl" target="_blank" class="text-orange-400 hover:text-orange-300">
                Téléchargez le PDF
              </a>
            </p>
          </iframe>
        </div>
      </div>
    </div>
  </main>
</template>