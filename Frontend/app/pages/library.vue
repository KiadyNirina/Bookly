<script setup lang="ts">
useHead({ title: 'Ma bibliothèque — PlumeStream' })

const config = useRuntimeConfig()
const { user, fetchUser } = useAuth()
const { getMyBooks, getSavedBooks } = useBooksApi()

function pictureUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${config.public.apiRoot}/${path.replace(/^\/+/, '')}`
}

await useAsyncData('library-user', async () => {
  if (!user.value) await fetchUser()
  return user.value
})

const activeTab = ref<'works' | 'saved'>('works')

const { data: myBooksPage, pending: loadingWorks } = await useAsyncData(
  'library-my-books',
  () => getMyBooks(),
)

const myBooks = computed(() => myBooksPage.value?.data ?? [])

const { data: savedBooksData, pending: loadingSaved } = await useAsyncData(
  'library-saved-books',
  async () => {
    if (!user.value?.id) return []
    return await getSavedBooks(user.value.id)
  },
  { default: () => [] as Book[], watch: [user] }
)
const savedBooks = computed(() => savedBooksData.value ?? [])

const currentList = computed(() =>
  activeTab.value === 'works' ? myBooks.value : savedBooks.value
)
const currentLoading = computed(() =>
  activeTab.value === 'works' ? loadingWorks.value : loadingSaved.value
)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">Ma bibliothèque</h1>
          <p class="text-slate-400 text-sm">
            Retrouvez vos œuvres et celles que vous avez sauvegardées.
          </p>
        </div>
        <NuxtLink
          to="/write"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition"
        >
          <Icon name="lucide:pen-line" class="w-4 h-4" />
          Écrire une nouvelle œuvre
        </NuxtLink>
      </div>

      <!-- Onglets -->
      <div class="flex items-center gap-1 mb-6 border-b border-slate-800">
        <button
          class="px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px"
          :class="activeTab === 'works'
            ? 'text-indigo-400 border-indigo-400'
            : 'text-slate-400 border-transparent hover:text-slate-200'"
          @click="activeTab = 'works'"
        >
          Mes œuvres
          <span v-if="myBooks.length" class="ml-1.5 text-xs text-slate-500">
            ({{ myBooks.length }})
          </span>
        </button>
        <button
          class="px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px"
          :class="activeTab === 'saved'
            ? 'text-indigo-400 border-indigo-400'
            : 'text-slate-400 border-transparent hover:text-slate-200'"
          @click="activeTab = 'saved'"
        >
          Sauvegardées
          <span v-if="savedBooks.length" class="ml-1.5 text-xs text-slate-500">
            ({{ savedBooks.length }})
          </span>
        </button>
      </div>

      <!-- Chargement -->
      <div v-if="currentLoading" class="flex items-center justify-center py-20 text-slate-500">
        <Icon name="lucide:loader-circle" class="w-6 h-6 animate-spin" />
      </div>

      <!-- Liste vide -->
      <div
        v-else-if="!currentList.length"
        class="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
          <Icon name="lucide:library" class="w-8 h-8 text-slate-500" />
        </div>
        <h2 class="text-lg font-semibold mb-2">
          {{ activeTab === 'works' ? 'Aucune œuvre pour l\'instant' : 'Aucune œuvre sauvegardée' }}
        </h2>
        <p class="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          {{ activeTab === 'works'
            ? 'Commencez à écrire votre première histoire et partagez-la avec la communauté.'
            : 'Parcourez les œuvres de la communauté et sauvegardez celles qui vous plaisent.' }}
        </p>
        <NuxtLink
          :to="activeTab === 'works' ? '/write' : '/discover'"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition"
        >
          <Icon :name="activeTab === 'works' ? 'lucide:pen-line' : 'lucide:compass'" class="w-4 h-4" />
          {{ activeTab === 'works' ? 'Écrire maintenant' : 'Découvrir des œuvres' }}
        </NuxtLink>
      </div>

      <!-- Grille -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="book in currentList"
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