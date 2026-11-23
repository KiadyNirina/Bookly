<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { user, fetchUser } = useAuth()
const { getBook } = useBooksApi()
const { saveBook, unsaveBook, checkIfSaved } = useSaveApi()

const bookId = Number(route.params.id)

await useAsyncData('book-user', async () => {
  if (!user.value) await fetchUser()
  return user.value
})

const { data: book, pending: loading } = await useAsyncData(
  `book-${bookId}`,
  () => getBook(bookId)
)

useHead(() => ({
  title: book.value ? `${book.value.title} — PlumeStream` : 'Livre — PlumeStream',
}))

const isSaved = ref(false)
const savingToggle = ref(false)
const isOwnBook = computed(() => book.value?.posted_by === user.value?.id)

onMounted(async () => {
  if (user.value?.id && book.value) {
    try {
      isSaved.value = await checkIfSaved(bookId, user.value.id)
    } catch { /* ignore */ }
  }
})

async function toggleSave() {
  if (!user.value?.id) {
    await navigateTo('/login')
    return
  }
  savingToggle.value = true
  try {
    if (isSaved.value) {
      await unsaveBook(bookId)
      isSaved.value = false
    } else {
      try {
        await saveBook(bookId, user.value.id)
        isSaved.value = true
      } catch (e: any) {
        // 409 = déjà sauvegardé, on considère que c'est OK
        if (e?.response?.status === 409) {
          isSaved.value = true
        } else {
          throw e
        }
      }
    }
  } catch (e) {
    console.error('Save toggle error', e)
  } finally {
    savingToggle.value = false
  }
}

function pictureUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${config.public.apiRoot}/${path.replace(/^\/+/, '')}`
}

const genres = computed(() =>
  book.value?.genre
    ? book.value.genre.split(',').map((g) => g.trim()).filter(Boolean)
    : []
)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
      <div v-if="loading" class="flex items-center justify-center py-20 text-slate-500">
        <Icon name="lucide:loader-circle" class="w-6 h-6 animate-spin" />
      </div>

      <div
        v-else-if="!book"
        class="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl"
      >
        <Icon name="lucide:book-x" class="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 class="text-lg font-semibold mb-2">Livre introuvable</h2>
        <NuxtLink to="/discover" class="text-indigo-400 hover:text-indigo-300 text-sm">
          ← Retour à la découverte
        </NuxtLink>
      </div>

      <div v-else class="grid md:grid-cols-[280px_1fr] gap-8">
        <div>
          <div class="aspect-[3/4] bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              v-if="book.picture"
              :src="pictureUrl(book.picture)!"
              :alt="book.title"
              class="w-full h-full object-cover"
            />
            <Icon v-else name="lucide:book-open" class="w-24 h-24 text-indigo-300/60" />
          </div>
        </div>

        <div>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="g in genres"
              :key="g"
              class="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300"
            >
              {{ g }}
            </span>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ book.title }}</h1>
          <p class="text-slate-400 mb-6">par {{ book.author }}</p>

          <p class="text-slate-300 leading-relaxed mb-8">{{ book.description }}</p>

          <div class="flex flex-wrap gap-6 mb-8 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <Icon name="lucide:file-text" class="w-4 h-4" />
              {{ book.page }} pages
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:languages" class="w-4 h-4" />
              {{ book.lang?.toUpperCase() }}
            </div>
            <div v-if="book.date" class="flex items-center gap-2">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              {{ new Date(book.date).toLocaleDateString('fr-FR') }}
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              :to="`/books/${book.id}/read`"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition"
            >
              <Icon name="lucide:book-open" class="w-4 h-4" />
              Lire maintenant
            </NuxtLink>

            <button
              v-if="!isOwnBook"
              :disabled="savingToggle"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition disabled:opacity-60"
              @click="toggleSave"
            >
              <Icon
                :name="isSaved ? 'lucide:bookmark-check' : 'lucide:bookmark'"
                class="w-4 h-4"
                :class="{ 'text-indigo-400': isSaved }"
              />
              {{ isSaved ? 'Sauvegardé' : 'Sauvegarder' }}
            </button>

            <NuxtLink
              v-if="isOwnBook"
              :to="`/books/${book.id}/edit`"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition"
            >
              <Icon name="lucide:pencil" class="w-4 h-4" />
              Modifier
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>