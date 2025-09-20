<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';

const books = ref([
  { title: 'Titre du Livre 1', author: 'Christophe RABEARIMANANA', postedBy: 'John Doe', cover: '../../public/cover 1.jpg', isPopular: true, link: 1 },
  { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', postedBy: 'John Doe', cover: '../../public/cover 2.jpg', isRecommended: true, link: 2 },
  { title: 'Titre du Livre 3', author: 'Auteur 1', postedBy: 'John Doe', cover: '../../public/cover 3.jpg', isPopular: true, link: 3 },
  { title: 'Titre du Livre 4', author: 'Auteur 2', postedBy: 'John Doe', cover: '../../public/cover 4.jfif', isRecommended: true, link: 4 },
]);

const currentSlide = ref(0);
const isMobile = ref(false);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % books.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + books.value.length) % books.value.length;
};

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
  
  setInterval(nextSlide, 5000);
});
</script>


<template>
  <main class="min-h-screen text-white">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between">
      <div class="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E67E22] to-orange-600 mb-6 font-[poppins-bold]">
          Découvrez un univers de lecture illimité
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          Des milliers de livres à portée de main, où que vous soyez
        </p>
        <a href="/books" class="inline-block px-8 py-4 bg-gradient-to-r from-[#E67E22] to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Explorer les nouveautés
        </a>
      </div>
      <div class="w-full md:w-1/2 flex justify-center">
        <img src="../../public/reading.svg" alt="Person reading" class="w-full max-w-md lg:max-w-lg xl:max-w-xl">
      </div>
    </section>

    <!-- Popular Books Section -->
    <section class="container mx-auto px-4 py-12">
      <div class="flex justify-between items-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-white">Livres Populaires</h2>
        <a href="/books/popular" class="text-orange-400 hover:text-orange-300 flex items-center transition-colors">
          Voir plus
          <Icon icon="ic:round-arrow-forward" class="ml-2" />
        </a>
      </div>

      <!-- Desktop Grid View -->
      <div class="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(book, index) in books" :key="index" class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20">
          <router-link :to="`/books/detail/${book.link}`">
            <div class="relative">
              <div v-if="book.isPopular" class="absolute top-3 left-3 z-10">
                <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
              </div>
              <div v-else-if="book.isRecommended" class="absolute top-3 left-3 z-10">
                <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Recommandé</span>
              </div>
              <img :src="book.cover" :alt="book.title" class="w-full h-60 object-cover">
            </div>
            
            <div class="p-4">
              <span class="inline-block bg-blue-900 bg-opacity-50 text-blue-200 text-xs font-semibold px-2 py-1 rounded mb-3">Fiction</span>
              
              <h3 class="text-lg font-bold text-white mb-1 truncate">{{ book.title }}</h3>
              <p class="text-sm text-gray-400 mb-3">{{ book.author }}</p>
              
              <div class="text-xs text-gray-500 mb-4">
                <p>Publié par <span class="font-semibold text-gray-300">{{ book.postedBy }}</span></p>
                <p>Lang : <span class="font-semibold text-gray-300">FR</span></p>
              </div>
              
              <div class="flex justify-between items-center text-sm text-gray-400">
                <div class="flex items-center">
                  <Icon icon="flowbite:star-solid" class="text-orange-500 mr-1" v-for="i in 4" :key="i" />
                  <Icon icon="flowbite:star-outline" class="text-orange-500" />
                </div>
                
                <div class="flex space-x-4">
                  <span class="flex items-center">
                    <Icon icon="entypo:eye" class="mr-1" />
                    1,3k
                  </span>
                  <span class="flex items-center">
                    <Icon icon="iconamoon:comment-fill" class="mr-1" />
                    112
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Mobile Carousel View -->
      <div class="md:hidden relative">
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(book, index) in books" :key="index" class="w-full flex-shrink-0 px-3">
              <div class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                <router-link :to="`/books/detail/${book.link}`">
                  <div class="relative">
                    <div v-if="book.isPopular" class="absolute top-3 left-3 z-10">
                      <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
                    </div>
                    <div v-else-if="book.isRecommended" class="absolute top-3 left-3 z-10">
                      <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Recommandé</span>
                    </div>
                    <img :src="book.cover" :alt="book.title" class="w-full h-48 object-cover">
                  </div>
                  
                  <div class="p-4">
                    <span class="inline-block bg-blue-900 bg-opacity-50 text-blue-200 text-xs font-semibold px-2 py-1 rounded mb-3">Fiction</span>
                    
                    <h3 class="text-lg font-bold text-white mb-1">{{ book.title }}</h3>
                    <p class="text-sm text-gray-400 mb-3 truncate">{{ book.author }}</p>
                    
                    <div class="flex justify-between items-center text-sm text-gray-400">
                      <div class="flex items-center">
                        <Icon icon="flowbite:star-solid" class="text-orange-500 mr-1" v-for="i in 4" :key="i" />
                        <Icon icon="flowbite:star-outline" class="text-orange-500" />
                      </div>
                      
                      <span class="flex items-center">
                        <Icon icon="entypo:eye" class="mr-1" />
                        1,3k
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Carousel Controls -->
        <button @click="prevSlide" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2">
          <Icon icon="ic:round-arrow-back" class="text-white text-xl" />
        </button>
        <button @click="nextSlide" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2">
          <Icon icon="ic:round-arrow-forward" class="text-white text-xl" />
        </button>
        
        <!-- Carousel Indicators -->
        <div class="flex justify-center mt-4 space-x-2">
          <button v-for="i in books.length" :key="i" 
                  @click="currentSlide = i - 1" 
                  :class="['w-2 h-2 rounded-full', currentSlide === i - 1 ? 'bg-orange-500' : 'bg-gray-600']">
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
@font-face {
  font-family: 'Poppins-bold';
  src: url('../../../../public/font/Poppins/Poppins-Bold.ttf');
}

/* Custom animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a202c;
}

::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>