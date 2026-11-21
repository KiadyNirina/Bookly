<template>
  <footer class="border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 text-xl font-bold mb-3">
          <Icon name="lucide:book-open" class="w-6 h-6 text-indigo-400" />
          <span>Plume<span class="text-indigo-400">Stream</span></span>
        </div>
        <p class="text-sm text-slate-400 max-w-sm">
          La plateforme des passionnés de lecture et d'écriture.
          Lisez, écrivez et partagez vos histoires en streaming.
        </p>
      </div>

      <div>
        <h4 class="font-semibold mb-4">Plateforme</h4>
        <ul class="space-y-2 text-sm text-slate-400">
          <li><NuxtLink to="/library" class="hover:text-white transition">Bibliothèque</NuxtLink></li>
          <li><NuxtLink to="/write" class="hover:text-white transition">Écrire</NuxtLink></li>
          <li><NuxtLink to="/discover" class="hover:text-white transition">Découvrir</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-4">Communauté</h4>
        <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="#" class="hover:text-white transition">Auteurs</a></li>
          <li><a href="#" class="hover:text-white transition">Blog</a></li>
          <li><a href="#" class="hover:text-white transition">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
      © {{ new Date().getFullYear() }} PlumeStream. Tous droits réservés.
    </div>
  </footer>
</template>