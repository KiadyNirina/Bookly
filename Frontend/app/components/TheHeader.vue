<template>
  <header class="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/70 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
        <span class="text-2xl">📖</span>
        <span>Plume<span class="text-indigo-400">Stream</span></span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300">
        <NuxtLink to="/library" class="hover:text-white transition">Bibliothèque</NuxtLink>
        <NuxtLink to="/write" class="hover:text-white transition">Écrire</NuxtLink>
        <NuxtLink to="/discover" class="hover:text-white transition">Découvrir</NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <NuxtLink to="/login" class="text-sm text-slate-300 hover:text-white transition hidden sm:block">
          Connexion
        </NuxtLink>
        <NuxtLink
          to="/signup"
          class="text-sm px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition"
        >
          S'inscrire
        </NuxtLink>
      </div>
    </div>
  </header>
</template>