<template>
  <section class="max-w-7xl mx-auto px-6 pb-24">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 md:p-16 text-center">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

      <div class="relative">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white">
          Prêt à partager votre histoire ?
        </h2>
        <p class="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Rejoignez une communauté de lecteurs et d'écrivains passionnés.
          Publiez votre première œuvre dès aujourd'hui, c'est gratuit.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/signup"
            class="px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition"
          >
            Créer un compte
          </NuxtLink>
          <NuxtLink
            to="/discover"
            class="px-8 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
          >
            Explorer les œuvres
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>