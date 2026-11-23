export interface Book {
  id: number
  title: string
  description?: string
  cover?: string
  genre?: string
  author?: { id: number; name: string }
  created_at?: string
}

export const useBooksApi = () => {
  const { $api } = useNuxtApp()

  async function getMyBooks(): Promise<Book[]> {
    return await $api('/user/books')
  }

  async function getMyBookCount(): Promise<number> {
    const res = await $api<{ count: number }>('/user/book/count')
    return res.count
  }

  async function getSavedBooks(userId: number): Promise<Book[]> {
    return await $api(`/user-saves/${userId}`)
  }

  return { getMyBooks, getMyBookCount, getSavedBooks }
}