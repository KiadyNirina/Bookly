import { ref } from 'vue'
import { useApi } from './useApi'

export function useLoadMoreBooks(perPage = 5) {
  const books = ref([])
  const currentPage = ref(1)
  const isLoading = ref(false)
  const hasMore = ref(true)
  const error = ref(null)

  const { request } = useApi()

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return

    isLoading.value = true
    try {
      const response = await request('GET', `/books/recent?page=${currentPage.value}&per_page=${perPage}`)
      const data = response.data.data
      console.log('Livres chargés :', data)
      console.log(data.length)

      if(!data && data.length === 0) {
        hasMore.value = false
      }

      // Ajoute les nouveaux livres à ceux déjà chargés
      books.value.push(...data)

      // Vérifie s'il y a d'autres pages à charger
      if (data.current_page >= data.last_page) {
        hasMore.value = false
      } else {
        currentPage.value += 1
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement des livres.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    books,
    isLoading,
    hasMore,
    error,
    loadMore,
  }
}
