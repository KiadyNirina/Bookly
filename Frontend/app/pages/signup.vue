<script setup lang="ts">
useHead({ title: 'Inscription — PlumeStream' })

const { register } = useAuth()
const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const fieldErrors = reactive<Record<string, string>>({})

function clearErrors() {
  error.value = ''
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

async function handleSubmit() {
  clearErrors()
  loading.value = true
  try {
    await register(form.name, form.email, form.password, form.password_confirmation)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (e: any) {
    const errors = e?.data?.errors
    if (errors) {
      Object.entries(errors).forEach(([field, messages]: [string, any]) => {
        fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages)
      })
    } else {
      error.value = e?.data?.message ?? "Une erreur est survenue lors de l'inscription."
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div class="relative w-full max-w-md">
        <div class="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <!-- En-tête -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-4">
              <Icon name="lucide:user-plus" class="w-7 h-7 text-indigo-400" />
            </div>
            <h1 class="text-2xl font-bold mb-2">Rejoignez PlumeStream</h1>
            <p class="text-sm text-slate-400">
              Créez votre compte pour lire, écrire et partager vos histoires.
            </p>
          </div>

          <!-- Erreur globale -->
          <div
            v-if="error"
            class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          >
            <Icon name="lucide:alert-circle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ error }}</span>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Nom -->
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
                  autocomplete="name"
                  placeholder="Votre nom"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
                  :class="{ 'border-red-500/50': fieldErrors.name }"
                />
              </div>
              <p v-if="fieldErrors.name" class="mt-1.5 text-xs text-red-400">
                {{ fieldErrors.name }}
              </p>
            </div>

            <!-- Email -->
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
                  autocomplete="email"
                  placeholder="vous@exemple.com"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
                  :class="{ 'border-red-500/50': fieldErrors.email }"
                />
              </div>
              <p v-if="fieldErrors.email" class="mt-1.5 text-xs text-red-400">
                {{ fieldErrors.email }}
              </p>
            </div>

            <!-- Mot de passe -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div class="relative">
                <Icon
                  name="lucide:lock"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                />
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  minlength="8"
                  placeholder="8 caractères minimum"
                  class="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
                  :class="{ 'border-red-500/50': fieldErrors.password }"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                  @click="showPassword = !showPassword"
                >
                  <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                </button>
              </div>
              <p v-if="fieldErrors.password" class="mt-1.5 text-xs text-red-400">
                {{ fieldErrors.password }}
              </p>
            </div>

            <!-- Confirmation -->
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-slate-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div class="relative">
                <Icon
                  name="lucide:lock"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                />
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  placeholder="••••••••"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
            >
              <Icon v-if="loading" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Création…' : 'Créer mon compte' }}
            </button>
          </form>

          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-slate-800"></div>
            <span class="text-xs text-slate-500">ou</span>
            <div class="flex-1 h-px bg-slate-800"></div>
          </div>

          <p class="text-center text-sm text-slate-400">
            Déjà un compte ?
            <NuxtLink to="/login" class="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Se connecter
            </NuxtLink>
          </p>
        </div>

        <div class="text-center mt-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>