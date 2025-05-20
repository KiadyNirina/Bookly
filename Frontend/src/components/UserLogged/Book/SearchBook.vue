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
      <ul>
        <li v-for="book in results.books" :key="book.id">
          {{ book.title }} — {{ book.author }}
        </li>
      </ul>

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
