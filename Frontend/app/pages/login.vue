<script setup lang="ts">
useHead({ title: 'Connexion — PlumeStream' })

const { login, googleLogin } = useAuth()
const route = useRoute()
const loadingGoogle = ref(false)

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleGoogleSuccess(response: { credential: string }) {
  loadingGoogle.value = true
  error.value = ''
  try {
    await googleLogin(response.credential)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'La connexion Google a échoué.'
  } finally {
    loadingGoogle.value = false
  }
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(form.email, form.password)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (e: any) {
    error.value =
      e?.data?.errors?.email?.[0] ??
      e?.data?.message ??
      'Identifiants invalides.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <!-- Décor de fond -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div class="relative w-full max-w-md">
        <!-- Carte -->
        <div class="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <!-- En-tête -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-4">
              <Icon name="lucide:book-open" class="w-7 h-7 text-indigo-400" />
            </div>
            <h1 class="text-2xl font-bold mb-2">Bon retour parmi nous</h1>
            <p class="text-sm text-slate-400">
              Connectez-vous pour retrouver votre bibliothèque et vos œuvres.
            </p>
          </div>

          <!-- Message d'erreur -->
          <div
            v-if="error"
            class="mb-6 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          >
            <Icon name="lucide:alert-circle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ error }}</span>
          </div>

          <!-- Formulaire -->
          <form class="space-y-5" @submit.prevent="handleSubmit">
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
                />
              </div>
            </div>

            <!-- Mot de passe -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <NuxtLink
                  to="/forgot-password"
                  class="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Mot de passe oublié ?
                </NuxtLink>
              </div>
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
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-100 placeholder-slate-600 transition"
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
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
            >
              <Icon v-if="loading" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Connexion…' : 'Se connecter' }}
            </button>
          </form>

          <!-- Séparateur -->
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-slate-800"></div>
            <span class="text-xs text-slate-500">ou</span>
            <div class="flex-1 h-px bg-slate-800"></div>
          </div>

          <!-- Bouton Google -->
          <div class="flex justify-center">
            <GoogleSignInButton
              :callback="handleGoogleSuccess"
              :loading="loadingGoogle"
            />
          </div>

          <!-- Lien inscription -->
          <p class="text-center text-sm text-slate-400">
            Pas encore de compte ?
            <NuxtLink to="/signup" class="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Créer un compte
            </NuxtLink>
          </p>
        </div>

        <!-- Retour accueil -->
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