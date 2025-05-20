import { ref, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export function useSearch() {
  const route = useRoute();
  const router = useRouter();
  const searchQuery = ref(route.query.q || '');
  const results = ref({ books: [], users: [] });
  const loading = ref(false);

  const fetchResults = async () => {
    if (!searchQuery.value) {
      results.value = { books: [], users: [] };
      return;
    }

    loading.value = true;
    try {
      const response = await axios.get('http://localhost:8000/api/search', {
        params: { q: searchQuery.value }
      });
      results.value = response.data;
    } catch (error) {
      console.error('Erreur de recherche :', error);
      results.value = { books: [], users: [] };
    } finally {
      loading.value = false;
    }
  };

  // Met à jour la route et déclenche la recherche
  const updateSearch = () => {
    if (searchQuery.value.trim() === '') {
      router.replace(route.fullPath.split('?')[0]); // retour à la page actuelle
      results.value = { books: [], users: [] };
    } else {
      router.push({ path: '/search', query: { q: searchQuery.value } });
      fetchResults();
    }
  };

  // Déclencher automatiquement une recherche quand on arrive sur /search?q=...
  watch(() => route.query.q, (newQ) => {
    searchQuery.value = newQ || '';
    fetchResults();
  }, { immediate: true });

  return { searchQuery, results, loading, updateSearch };
}
