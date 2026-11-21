<script setup>
const features = [
  {
    icon: 'lucide:library',
    title: 'Lecture en streaming',
    description: 'Accédez à des milliers de romans, poèmes et nouvelles instantanément, sans téléchargement. Reprenez votre lecture où vous l\'avez laissée.',
  },
  {
    icon: 'lucide:pen-line',
    title: 'Publiez vos œuvres',
    description: 'Partagez vos romans, poèmes et nouvelles avec une communauté passionnée. Un éditeur intégré vous accompagne dans la création.',
  },
  {
    icon: 'lucide:compass',
    title: 'Découvrez de nouveaux talents',
    description: 'Explorez des créations originales par genre, thème ou popularité. Soutenez les auteurs émergents et vivez de nouvelles aventures.',
  },
  {
    icon: 'lucide:message-circle',
    title: 'Communauté active',
    description: 'Commentez, échangez et progressez avec d\'autres écrivains et lecteurs. Des retours constructifs pour faire grandir vos histoires.',
  },
  {
    icon: 'lucide:award',
    title: 'Mettez vos œuvres en avant',
    description: 'Un système de recommandations et de classements permet à vos écrits de toucher le bon public au bon moment.',
  },
  {
    icon: 'lucide:smartphone',
    title: 'Lecture partout',
    description: 'Sur ordinateur, tablette ou mobile, votre bibliothèque vous suit. Synchronisation automatique entre tous vos appareils.',
  },
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-24">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Tout ce qu'il faut pour <span class="text-indigo-400">lire et écrire</span>
      </h2>
      <p class="text-slate-400 max-w-2xl mx-auto">
        Une expérience complète pour les amoureux des mots, que vous soyez lecteur, écrivain ou les deux.
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition"
      >
        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
          <Icon :name="feature.icon" class="w-6 h-6 text-indigo-400" />
        </div>
        <h3 class="text-lg font-semibold mb-2 group-hover:text-indigo-300 transition">
          {{ feature.title }}
        </h3>
        <p class="text-sm text-slate-400 leading-relaxed">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>