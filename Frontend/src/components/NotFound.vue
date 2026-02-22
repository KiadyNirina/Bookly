<template>
  <main class="min-h-screen flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
    <div class="absolute w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -z-10"></div>

    <div class="text-center max-w-2xl">
      <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block animate-fade-in">
        Erreur de navigation
      </span>

      <h1 class="text-[12rem] md:text-[18rem] font-black italic tracking-tighter leading-none text-white/5 select-none relative">
        404
        <span class="absolute inset-0 flex items-center justify-center text-3xl md:text-5xl text-white italic font-black tracking-tighter">
          Chapitre <span class="text-orange-500 ml-3">Introuvable</span>
        </span>
      </h1>

      <div class="mt-8 space-y-6">
        <p class="text-white/40 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
          Même les meilleurs lecteurs se perdent parfois entre les lignes. La page que vous cherchez a sans doute été classée dans une section secrète ou n'a jamais été écrite.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <router-link 
            to="/" 
            class="group relative px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all border border-orange-500 overflow-hidden"
          >
            <span class="relative z-10 text-orange-500 group-hover:text-black transition-colors duration-300">
              Retour à l'accueil
            </span>
            <div class="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </router-link>

          <button 
            @click="$router.back()" 
            class="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors flex items-center gap-2"
          >
            <Icon icon="lucide:arrow-left" /> Page précédente
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

h1 {
  line-height: 0.8;
}
</style>