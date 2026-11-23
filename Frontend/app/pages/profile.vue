<script setup lang="ts">
useHead({ title: 'Mon profil — PlumeStream' })

const { user, fetchUser, logout } = useAuth()
const { updateProfile, deleteAccount } = useProfileApi()

await useAsyncData('profile-user', async () => {
  if (!user.value) await fetchUser()
  return user.value
})

const form = reactive({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
})

const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fieldErrors = reactive<Record<string, string>>({})

const showDeleteConfirm = ref(false)
const deleting = ref(false)

function clearErrors() {
  errorMessage.value = ''
  successMessage.value = ''
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

async function handleUpdate() {
  clearErrors()
  saving.value = true
  try {
    await updateProfile({ name: form.name, email: form.email })
    await fetchUser()
    successMessage.value = 'Profil mis à jour avec succès.'
    setTimeout(() => { successMessage.value = '' }, 4000)
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
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await deleteAccount()
    await logout()
  } catch (e: any) {
    errorMessage.value = e?.data?.message ?? 'Impossible de supprimer le compte.'
    showDeleteConfirm.value = false
  } finally {
    deleting.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
      <h1 class="text-3xl font-bold mb-8">Mon profil</h1>

      <!-- Carte principale -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 mb-6">
        <!-- Avatar + infos -->
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
            {{ user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>
          <div>
            <p class="text-lg font-semibold">{{ user?.name ?? 'Utilisateur' }}</p>
            <p class="text-sm text-slate-400">{{ user?.email ?? '' }}</p>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-if="successMessage"
          class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm"
        >
          <Icon name="lucide:check-circle" class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ successMessage }}</span>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
        >
          <Icon name="lucide:alert-circle" class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Formulaire -->
        <form class="space-y-5" @submit.prevent="handleUpdate">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
              Nom complet
            </label>
            <div class="relative">
              <Icon
                name="lucide:user"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              />
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 transition"
                :class="{ 'border-red-500/50': fieldErrors.name }"
              />
            </div>
            <p v-if="fieldErrors.name" class="mt-1.5 text-xs text-red-400">
              {{ fieldErrors.name }}
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
              Adresse email
            </label>
            <div class="relative">
              <Icon
                name="lucide:mail"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              />
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 transition"
                :class="{ 'border-red-500/50': fieldErrors.email }"
              />
            </div>
            <p v-if="fieldErrors.email" class="mt-1.5 text-xs text-red-400">
              {{ fieldErrors.email }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="saving"
            class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
          >
            <Icon v-if="saving" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </form>
      </div>

      <!-- Zone dangereuse -->
      <div class="bg-slate-900/70 border border-red-500/30 rounded-2xl p-8">
        <h2 class="text-lg font-semibold text-red-300 mb-2">Zone dangereuse</h2>
        <p class="text-sm text-slate-400 mb-4">
          La suppression de votre compte est définitive. Toutes vos œuvres et données seront perdues.
        </p>

        <div v-if="!showDeleteConfirm">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
            @click="showDeleteConfirm = true"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4" />
            Supprimer mon compte
          </button>
        </div>

        <div v-else class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p class="text-sm text-red-300">Êtes-vous sûr ? Cette action est irréversible.</p>
          <div class="flex gap-2">
            <button
              :disabled="deleting"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-sm font-medium transition"
              @click="handleDelete"
            >
              <Icon v-if="deleting" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
              {{ deleting ? 'Suppression…' : 'Confirmer' }}
            </button>
            <button
              class="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition"
              @click="showDeleteConfirm = false"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>