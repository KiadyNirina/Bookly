import { ref } from 'vue'
import { useApi } from './useApi'
import { useUser } from './useUser'
import Swal from 'sweetalert2'

export function useBook() {
  const book = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const { user } = useUser()

  const { request } = useApi()

  const fetchBook = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await request('get', `/books/${id}`)
      book.value = response.data
      console.log('Livre récupéré :', book.value)
    } catch (err) {
      error.value = "Erreur lors de la récupération du livre."
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const createBook = async (bookData) => {
    isLoading.value = true
    error.value = null
    success.value = null
    
    try {
      const formData = new FormData()
      
      formData.append('title', bookData.title)
      formData.append('author', bookData.author)
      formData.append('description', bookData.description)
      formData.append('genre', bookData.genre)
      formData.append('posted_by', user.value.id)
      formData.append('lang', bookData.lang)
      formData.append('page', bookData.page)
      
      if (bookData.picture) formData.append('picture', bookData.picture)
      if (bookData.file) formData.append('file', bookData.file)

      const response = await request('post', '/createBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      success.value = "Livre créé avec succès!"
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || "Erreur lors de la création du livre."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteBook = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Cette action supprimera définitivement le livre.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      })

      if (result.isConfirmed) {
        await request('delete', `/deleteBook/${id}`)
        Swal.fire({
          title: 'Supprimé !',
          text: 'Le livre a été supprimé avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        return true 
      }
    } catch (err) {
      error.value = "Erreur lors de la suppression du livre."
      console.error(err)
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la suppression du livre.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }
    return false
  }

  return {
    book,
    isLoading,
    error,
    success,
    fetchBook,
    createBook,
    deleteBook
  }
}