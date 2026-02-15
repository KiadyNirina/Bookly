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
      const formData = new FormData();
        formData.append('book', id)
        formData.append('user', user.value.id)  
      const response = await request('post', '/saveBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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