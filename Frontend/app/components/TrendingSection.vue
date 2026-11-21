<script setup>
const works = [
  { title: 'Les Ombres du Crépuscule', author: '@Amina_Écrit', type: 'Roman', rating: 4.8, emoji: '🌙' },
  { title: 'Fragments de Verre', author: '@LuciePoésie', type: 'Poésie', rating: 4.9, emoji: '🪞' },
  { title: 'Le Dernier Train', author: '@MarcNouvelle', type: 'Nouvelle', rating: 4.7, emoji: '🚂' },
  { title: 'Éclats d\'Étoiles', author: '@Noah_Story', type: 'Roman', rating: 4.6, emoji: '⭐' },
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 pb-24">
    <div class="flex items-end justify-between mb-10">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold mb-2">Tendances du moment</h2>
        <p class="text-slate-400">Les œuvres les plus lues cette semaine.</p>
      </div>
      <NuxtLink to="/discover" class="text-sm text-indigo-400 hover:text-indigo-300 transition">
        Tout voir →
      </NuxtLink>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="work in works"
        :key="work.title"
        class="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition cursor-pointer"
      >
        <div class="aspect-[3/4] bg-gradient-to-br from-indigo-900/50 to-slate-900 flex items-center justify-center text-6xl group-hover:scale-105 transition">
          {{ work.emoji }}
        </div>
        <div class="p-4">
          <span class="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
            {{ work.type }}
          </span>
          <h3 class="font-semibold mt-2 group-hover:text-indigo-300 transition">{{ work.title }}</h3>
          <p class="text-xs text-slate-500 mt-1">{{ work.author }}</p>
          <div class="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span>⭐ {{ work.rating }}</span>
            <span class="text-indigo-400">Lire →</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>