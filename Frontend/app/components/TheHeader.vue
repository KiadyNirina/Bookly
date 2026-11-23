<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth()

const menuOpen = ref(false)
const userMenuOpen = ref(false)

// Fermer le menu utilisateur si on clique ailleurs
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-user-menu]')) {
    userMenuOpen.value = false
  }
}

async function handleLogout() {
  userMenuOpen.value = false
  await logout()
}
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/70 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
        <Icon name="lucide:book-open" class="w-6 h-6 text-indigo-400" />
        <span>Plume<span class="text-indigo-400">Stream</span></span>
      </NuxtLink>

      <!-- Navigation desktop -->
      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300">
        <NuxtLink to="/library" class="hover:text-white transition">Bibliothèque</NuxtLink>
        <NuxtLink to="/write" class="hover:text-white transition">Écrire</NuxtLink>
        <NuxtLink to="/discover" class="hover:text-white transition">Découvrir</NuxtLink>
      </nav>

      <!-- Actions : connecté vs déconnecté -->
      <div class="flex items-center gap-3">
        <template v-if="!isAuthenticated">
          <NuxtLink
            to="/login"
            class="text-sm text-slate-300 hover:text-white transition hidden sm:block"
          >
            Connexion
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="text-sm px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition"
          >
            S'inscrire
          </NuxtLink>
        </template>

        <template v-else>
          <!-- Menu utilisateur -->
          <div class="relative" data-user-menu>
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/70 transition"
              :aria-expanded="userMenuOpen"
              @click="userMenuOpen = !userMenuOpen"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                {{ user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
              </div>
              <span class="hidden sm:block text-sm text-slate-200 max-w-[120px] truncate">
                {{ user?.name ?? 'Utilisateur' }}
              </span>
              <Icon
                name="lucide:chevron-down"
                class="w-4 h-4 text-slate-400 transition"
                :class="{ 'rotate-180': userMenuOpen }"
              />
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 overflow-hidden"
              >
                <div class="px-4 py-2.5 border-b border-slate-800">
                  <p class="text-sm font-medium text-slate-100 truncate">
                    {{ user?.name ?? 'Utilisateur' }}
                  </p>
                  <p class="text-xs text-slate-500 truncate">
                    {{ user?.email ?? '' }}
                  </p>
                </div>

                <NuxtLink
                  to="/profile"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition"
                  @click="userMenuOpen = false"
                >
                  <Icon name="lucide:user" class="w-4 h-4" />
                  Mon profil
                </NuxtLink>

                <NuxtLink
                  to="/library"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition"
                  @click="userMenuOpen = false"
                >
                  <Icon name="lucide:library" class="w-4 h-4" />
                  Ma bibliothèque
                </NuxtLink>

                <div class="my-1 h-px bg-slate-800"></div>

                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                  @click="handleLogout"
                >
                  <Icon name="lucide:log-out" class="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>