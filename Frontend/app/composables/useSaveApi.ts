export const useSaveApi = () => {
  const { $api, $apiAuth } = useNuxtApp()

  async function saveBook(bookId: number, userId: number) {
    return await $apiAuth('/saveBook', {
      method: 'POST',
      body: { book: bookId, user: userId },
    })
  }

  async function unsaveBook(bookId: number) {
    return await $apiAuth(`/unsave/${bookId}`, { method: 'DELETE' })
  }

  async function checkIfSaved(bookId: number, userId: number): Promise<boolean> {
    const res = await $api<{ saved: boolean }>(`/check-saved/${bookId}/${userId}`)
    return Boolean(res?.saved)
  }

  return { saveBook, unsaveBook, checkIfSaved }
}