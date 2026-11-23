<script setup lang="ts">
useHead({ title: 'Écrire — PlumeStream' })

const { user, fetchUser } = useAuth()
const { createBook } = useBooksApi()

await useAsyncData('write-user', async () => {
  if (!user.value) await fetchUser()
  return user.value
})

const form = reactive({
  title: '',
  author: '',
  description: '',
  lang: 'fr',
  page: 1,
})

// Sélection multiple de genres
const selectedGenres = ref<string[]>([])
const customGenre = ref('')
const showCustomGenre = ref(false)

const pictureFile = ref<File | null>(null)
const picturePreview = ref<string | null>(null)
const bookFile = ref<File | null>(null)

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fieldErrors = reactive<Record<string, string>>({})

function toggleGenre(genre: string) {
  const idx = selectedGenres.value.indexOf(genre)
  if (idx >= 0) selectedGenres.value.splice(idx, 1)
  else selectedGenres.value.push(genre)
}

function addCustomGenre() {
  const g = customGenre.value.trim()
  if (!g) return
  if (!selectedGenres.value.includes(g)) selectedGenres.value.push(g)
  customGenre.value = ''
  showCustomGenre.value = false
}

function onPictureChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  pictureFile.value = file
  picturePreview.value = URL.createObjectURL(file)
}

function onBookFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) bookFile.value = file
}

function clearErrors() {
  errorMessage.value = ''
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

async function handleSubmit() {
  clearErrors()

  if (!user.value?.id) {
    errorMessage.value = 'Vous devez être connecté.'
    return
  }
  if (!selectedGenres.value.length) {
    fieldErrors.genre = 'Choisissez au moins un genre.'
    return
  }
  if (!bookFile.value) {
    fieldErrors.file = 'Le fichier du livre est requis (PDF, DOC, DOCX).'
    return
  }

  submitting.value = true
  try {
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('author', form.author)
    payload.append('description', form.description)
    payload.append('genre', selectedGenres.value.join(', '))
    payload.append('lang', form.lang)
    payload.append('page', String(form.page))
    payload.append('posted_by', String(user.value.id))
    if (pictureFile.value) payload.append('picture', pictureFile.value)
    payload.append('file', bookFile.value)

    await createBook(payload)

    successMessage.value = 'Œuvre publiée avec succès !'
    setTimeout(() => navigateTo('/library'), 1200)
  } catch (e: any) {
    const errors = e?.data?.errors
    if (errors) {
      Object.entries(errors).forEach(([field, messages]: [string, any]) => {
        fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages)
      })
    } else {
      errorMessage.value = e?.data?.message ?? 'Une erreur est survenue.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Écrire une nouvelle œuvre</h1>
        <p class="text-slate-400 text-sm">
          Partagez votre roman, poème ou nouvelle avec la communauté.
        </p>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
        <Icon name="lucide:check-circle" class="w-4 h-4 mt-0.5 shrink-0" />
        <span>{{ successMessage }}</span>
      </div>
      <div v-if="errorMessage" class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        <Icon name="lucide:alert-circle" class="w-4 h-4 mt-0.5 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Titre -->
        <div>
          <label for="title" class="block text-sm font-medium text-slate-300 mb-2">
            Titre <span class="text-red-400">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
            :class="{ 'border-red-500/50': fieldErrors.title }"
          />
          <p v-if="fieldErrors.title" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.title }}</p>
        </div>

        <!-- Auteur + Langue -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="author" class="block text-sm font-medium text-slate-300 mb-2">
              Auteur <span class="text-red-400">*</span>
            </label>
            <input
              id="author"
              v-model="form.author"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
              :class="{ 'border-red-500/50': fieldErrors.author }"
            />
            <p v-if="fieldErrors.author" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.author }}</p>
          </div>
          <div>
            <label for="lang" class="block text-sm font-medium text-slate-300 mb-2">
              Langue <span class="text-red-400">*</span>
            </label>
            <select
              id="lang"
              v-model="form.lang"
              required
              class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 transition"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="mg">Malgache</option>
            </select>
          </div>
        </div>

        <!-- Genres (multi-sélection) -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Genres <span class="text-red-400">*</span>
            <span class="text-xs text-slate-500 font-normal ml-1">(plusieurs possibles)</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="genre in GENRES"
              :key="genre"
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border transition"
              :class="selectedGenres.includes(genre)
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </button>

            <!-- Genre personnalisé déjà ajouté -->
            <button
              v-for="genre in selectedGenres.filter(g => !GENRES.includes(g as any))"
              :key="genre"
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border bg-purple-500 border-purple-500 text-white transition"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
              <Icon name="lucide:x" class="w-3 h-3 inline ml-1" />
            </button>

            <!-- Bouton ajouter autre -->
            <button
              v-if="!showCustomGenre"
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-300 transition"
              @click="showCustomGenre = true"
            >
              + Autre
            </button>
          </div>

          <!-- Input genre personnalisé -->
          <div v-if="showCustomGenre" class="mt-3 flex gap-2">
            <input
              v-model="customGenre"
              type="text"
              placeholder="Autre genre…"
              maxlength="40"
              class="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
              @keydown.enter.prevent="addCustomGenre"
            />
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition"
              @click="addCustomGenre"
            >
              Ajouter
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition"
              @click="showCustomGenre = false; customGenre = ''"
            >
              Annuler
            </button>
          </div>

          <!-- Genres sélectionnés -->
          <p v-if="selectedGenres.length" class="mt-2 text-xs text-slate-500">
            Sélection : {{ selectedGenres.join(', ') }}
          </p>

          <p v-if="fieldErrors.genre" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.genre }}</p>
        </div>

        <!-- Pages -->
        <div>
          <label for="page" class="block text-sm font-medium text-slate-300 mb-2">
            Nombre de pages <span class="text-red-400">*</span>
          </label>
          <input
            id="page"
            v-model.number="form.page"
            type="number"
            min="1"
            required
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 transition"
            :class="{ 'border-red-500/50': fieldErrors.page }"
          />
          <p v-if="fieldErrors.page" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.page }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
            Description <span class="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition resize-none"
            :class="{ 'border-red-500/50': fieldErrors.description }"
          />
          <p v-if="fieldErrors.description" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.description }}</p>
        </div>

        <!-- Fichiers -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Couverture</label>
            <label class="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer transition">
              <img v-if="picturePreview" :src="picturePreview" class="w-24 h-32 object-cover rounded" alt="Aperçu" />
              <Icon v-else name="lucide:image-plus" class="w-8 h-8 text-slate-500" />
              <span class="text-xs text-slate-400">
                {{ pictureFile ? pictureFile.name : 'Image (JPEG, PNG, SVG)' }}
              </span>
              <input type="file" accept="image/*" class="hidden" @change="onPictureChange" />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Fichier du livre <span class="text-red-400">*</span>
            </label>
            <label class="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer transition h-full"
              :class="{ 'border-red-500/50': fieldErrors.file }">
              <Icon name="lucide:file-up" class="w-8 h-8 text-slate-500" />
              <span class="text-xs text-slate-400 text-center">
                {{ bookFile ? bookFile.name : 'PDF, DOC, DOCX' }}
              </span>
              <input type="file" accept=".pdf,.doc,.docx" class="hidden" @change="onBookFileChange" />
            </label>
            <p v-if="fieldErrors.file" class="mt-1.5 text-xs text-red-400">{{ fieldErrors.file }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <NuxtLink to="/library" class="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition">
            Annuler
          </NuxtLink>
          <button type="submit" :disabled="submitting"
            class="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition">
            <Icon v-if="submitting" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:send" class="w-4 h-4" />
            {{ submitting ? 'Publication…' : 'Publier' }}
          </button>
        </div>
      </form>
    </main>

    <TheFooter />
  </div>
</template>