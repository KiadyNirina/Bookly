<script setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import apiClient from '@/plugins/axios';

const route = useRoute();
const results = ref({ books: [], users: [] });

const fetchResults = async (query) => {
  try {
    const res = await apiClient.get('/search', { params: { q: query } });
    results.value = res.data;
  } catch {
    results.value = { books: [], users: [] };
  }
};

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
}

watch(
  () => route.query.q,
  (q) => {
    if (q) fetchResults(q);
    else results.value = { books: [], users: [] };
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto mt-10 text-white">
    <h1 class="text-2xl font-bold mb-4">Résultats pour "{{ searchQuery }}"</h1>

    <div v-if="loading">Chargement...</div>

    <div v-else>
      <h2 class="text-xl font-semibold mt-4">📚 Livres</h2>
      <div class="card">
        <a :href="`/books/${book.id}`" class="book" v-for="book in results.books" :key="book.id">
          <img :src="getImageUrl(book.picture)" :alt="book.title">
          <p id="type">{{ book.genre }}</p>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <p id="postedBy">
              Publié par <b>{{ book.posted_by.name }}</b>,<br>
              Le <b>{{ formatDate(book.created_at) }}</b>,<br>
              Lang : <b>FR</b>
            </p>
            <div class="content-book">
              <div class="note">
                <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                <Icon icon="flowbite:star-outline" class="text-[#E67E22]" />
              </div>
              <span>
                <Icon icon="entypo:eye" class="mr-1" />
                1,3k
              </span>
              <span>
                <Icon icon="iconamoon:comment-fill" class="mr-1" />
                112
              </span>
              <span>
                <Icon icon="ic:round-download" class="mr-1" />  
                900
              </span>
            </div>
          </div>
        </a>
      </div>

      <h2 class="text-xl font-semibold mt-4">👤 Utilisateurs</h2>
      <ul>
        <li v-for="user in results.users" :key="user.id">
          {{ user.name }} — {{ user.email }}
        </li>
      </ul>

      <div v-if="results.books.length === 0 && results.users.length === 0">
        Aucun résultat trouvé.
      </div>
    </div>
  </div>
</template>
