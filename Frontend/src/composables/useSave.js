import { ref } from 'vue'
import { useApi } from './useApi'
import { useUser } from './useUser'
import Swal from 'sweetalert2'

export function useSave() {
  const book = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const { user } = useUser()

  const { request } = useApi()

  const saveBook = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await request('post', '/saveBook', {
        book: id,
        user: user.value.id
      })

      book.value = response.data
      console.log('Livre enregistré :', book.value)

      return book.value;
    } catch (err) {
      error.value = "Erreur lors de l enregistrement du livre."
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    book,
    isLoading,
    error,
    success,
    saveBook
  }
}