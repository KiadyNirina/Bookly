<script setup lang="ts">
useHead({ title: 'Découvrir — PlumeStream' })

const config = useRuntimeConfig()
const { getRecentBooks, searchBooks } = useBooksApi()

// Recherche
const searchQuery = ref('')
const searchResults = ref<Book[] | null>(null)
const searching = ref(false)

const selectedGenre = ref<string | null>(null)

const { data: recentPage, pending: loadingRecent } = await useAsyncData(
  'recent-books',
  () => getRecentBooks(),
)

const recentBooks = computed(() => recentPage.value?.data ?? [])

const genres = computed(() => {
  const set = new Set<string>()
  const list = searchResults.value ?? recentBooks.value
  for (const book of list) {
    if (!book.genre) continue
    for (const g of book.genre.split(',')) {
      const clean = g.trim()
      if (clean) set.add(clean)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredBooks = computed(() => {
  const list = searchResults.value ?? recentBooks.value
  if (!selectedGenre.value) return list
  return list.filter((b) =>
    b.genre?.split(',').map((g) => g.trim()).includes(selectedGenre.value!)
  )
})

// Helper URL image
function pictureUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${config.public.apiRoot}/${path.replace(/^\/+/, '')}`
}

// Recherche debouncée
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (q) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!q.trim()) {
    searchResults.value = null
    selectedGenre.value = null
    return
  }
  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      const res = await searchBooks(q.trim())
      searchResults.value = res.books ?? []
      selectedGenre.value = null
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }, 350)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Découvrir</h1>
        <p class="text-slate-400 text-sm">
          Explorez les créations de la communauté : romans, poèmes et nouvelles.
        </p>
      </div>

      <!-- Barre de recherche -->
      <div class="relative mb-8">
        <Icon
          name="lucide:search"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un titre, un auteur, un genre…"
          class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-500 transition"
        />
        <Icon
          v-if="searching"
          name="lucide:loader-circle"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 animate-spin"
        />
      </div>

      <!-- Filtres genres -->
      <div v-if="genres.length" class="flex flex-wrap items-center gap-2 mb-8">
        <button
          class="px-3 py-1.5 rounded-full text-xs font-medium border transition"
          :class="!selectedGenre
            ? 'bg-indigo-500 border-indigo-500 text-white'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'"
          @click="selectedGenre = null"
        >
          Tous
        </button>
        <button
          v-for="genre in genres"
          :key="genre"
          class="px-3 py-1.5 rounded-full text-xs font-medium border transition"
          :class="selectedGenre === genre
            ? 'bg-indigo-500 border-indigo-500 text-white'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'"
          @click="selectedGenre = genre"
        >
          {{ genre }}
        </button>
      </div>

      <!-- Titre de section -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">
          {{ searchQuery
            ? `Résultats pour « ${searchQuery} »`
            : selectedGenre
              ? `Genre : ${selectedGenre}`
              : 'Ajouts récents' }}
        </h2>
        <span v-if="filteredBooks.length" class="text-xs text-slate-500">
          {{ filteredBooks.length }} œuvre{{ filteredBooks.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Chargement -->
      <div v-if="loadingRecent && !searchResults" class="flex items-center justify-center py-20 text-slate-500">
        <Icon name="lucide:loader-circle" class="w-6 h-6 animate-spin" />
      </div>

      <!-- Vide -->
      <div
        v-else-if="!filteredBooks.length"
        class="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
          <Icon name="lucide:search-x" class="w-8 h-8 text-slate-500" />
        </div>
        <h2 class="text-lg font-semibold mb-2">Aucune œuvre trouvée</h2>
        <p class="text-sm text-slate-400 max-w-sm mx-auto">
          {{ searchQuery
            ? 'Essayez avec d\'autres mots-clés ou explorez les ajouts récents.'
            : 'Revenez plus tard, de nouvelles œuvres sont publiées régulièrement.' }}
        </p>
      </div>

      <!-- Grille -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="book in filteredBooks"
          :key="book.id"
          :to="`/books/${book.id}`"
          class="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition"
        >
          <div class="aspect-[3/4] bg-gradient-to-br from-indigo-900/50 to-slate-900 flex items-center justify-center overflow-hidden">
            <img
              v-if="book.picture"
              :src="pictureUrl(book.picture)!"
              :alt="book.title"
              class="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <Icon v-else name="lucide:book-open" class="w-16 h-16 text-indigo-300/60" />
          </div>
          <div class="p-4">
            <div class="flex flex-wrap gap-1 mb-2">
              <span
                v-for="g in book.genre.split(',').map(s => s.trim()).filter(Boolean)"
                :key="g"
                class="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300"
              >
                {{ g }}
              </span>
            </div>
            <h3 class="font-semibold mt-2 group-hover:text-indigo-300 transition line-clamp-1">
              {{ book.title }}
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              {{ book.author ?? 'Auteur inconnu' }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </main>

    <TheFooter />
  </div>
</template>