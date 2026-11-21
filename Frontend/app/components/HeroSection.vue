<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-slate-950"></div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

    <div class="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6">
          ✨ Lecture & écriture en streaming
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Lisez, écrivez,<br />
          <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            partagez vos histoires
          </span>
        </h1>
        <p class="text-lg text-slate-400 mb-8 max-w-lg">
          Une plateforme où les passionnés de lecture et d'écriture se retrouvent.
          Découvrez des romans, poèmes et nouvelles en streaming, ou publiez vos propres créations.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink
            to="/signup"
            class="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-center transition"
          >
            Commencer à lire
          </NuxtLink>
          <NuxtLink
            to="/write"
            class="px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-center transition"
          >
            Publier mon œuvre
          </NuxtLink>
        </div>
        <div class="flex items-center gap-6 mt-10 text-sm text-slate-400">
          <div><span class="text-white font-bold text-lg">12k+</span> lecteurs</div>
          <div class="w-px h-8 bg-slate-800"></div>
          <div><span class="text-white font-bold text-lg">3.5k</span> œuvres</div>
          <div class="w-px h-8 bg-slate-800"></div>
          <div><span class="text-white font-bold text-lg">48k</span> chapitres lus</div>
        </div>
      </div>

      <div class="relative">
        <div class="relative mx-auto w-full max-w-sm">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-30"></div>
          <div class="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
              <div>
                <p class="text-sm font-semibold">Les Ombres du Crépuscule</p>
                <p class="text-xs text-slate-500">par @Amina_Écrit</p>
              </div>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              "La nuit tombait sur la ville endormie, et pourtant, une lumière
              persistait à filtrer sous la porte de l'atelier..."
            </p>
            <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>📖 Chapitre 3 / 24</span>
              <span>⭐ 4.8</span>
            </div>
            <div class="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full w-1/3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>