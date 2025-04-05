import { ref } from 'vue'
import { useApi } from './useApi'
import Swal from 'sweetalert2'

export function useBook() {
  const book = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

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
    fetchBook,
    deleteBook
  }
}