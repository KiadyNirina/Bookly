<script setup>
import { computed } from 'vue';
import { useSearchStore } from '@/stores/searchStore';

const store = useSearchStore();

const results = [
  { id: 1, title: 'Le Petit Prince', author: 'Saint-Exupéry' },
  { id: 2, title: 'L’Étranger', author: 'Camus' },
  { id: 3, title: 'Les Misérables', author: 'Victor Hugo' }
];

const filteredResults = computed(() => {
  const q = store.query.toLowerCase();
  return results.filter(
    r =>
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q)
  );
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-4 text-white">
      Résultats pour "{{ store.query }}"
    </h1>

    <div v-if="filteredResults.length">
      <ul>
        <li v-for="r in filteredResults" :key="r.id">
          {{ r.title }} — {{ r.author }}
        </li>
      </ul>
    </div>
    <p v-else class="text-gray-400">Aucun résultat trouvé.</p>
  </div>
</template>
