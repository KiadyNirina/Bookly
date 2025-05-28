import { ref } from 'vue'
import { useApi } from './useApi'

export function useLoadMoreBooks(perPage = 5) {
  const books = ref([]);
  const currentPage = ref(1);
  const isLoading = ref(false);
  const hasMore = ref(true);
  const error = ref(null);

  const { request } = useApi();

  const handleResponse = (response) => {
    const data = response.data?.data;

    if (!data || data.length === 0) {
      hasMore.value = false;
      return;
    }

    books.value.push(...data);

    const currentPageApi = response.data?.current_page;
    const lastPageApi = response.data?.last_page;

    if (currentPageApi >= lastPageApi) {
      hasMore.value = false;
    } else {
      currentPage.value += 1;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;
    try {
      const response = await request(
        'GET',
        `/books/recent?page=${currentPage.value}&per_page=${perPage}`
      );
      handleResponse(response);
    } catch (err) {
      error.value = 'Erreur lors du chargement des livres.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMoreUserBook = async () => {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;
    try {
      const response = await request(
        'GET',
        `/user/books?page=${currentPage.value}&per_page=${perPage}`
      );
      handleResponse(response);
    } catch (err) {
      error.value = 'Erreur lors du chargement des livres.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMoreBooks = async (userId) => {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;
    try {
      const response = await request(
        'GET',
        `/user/${userId}/books?page=${currentPage.value}&per_page=${perPage}`
      );
      handleResponse(response);
    } catch (err) {
      error.value = 'Erreur lors du chargement des livres de l\'utilisateur.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    books,
    isLoading,
    hasMore,
    error,
    loadMore,
    loadMoreUserBook,
    loadMoreBooks,
  };
}
