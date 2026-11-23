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

  async function getRecentBooks(): Promise<Book[]> {
    return await $api('/books/recent')
  }

  async function searchBooks(query: string): Promise<Book[]> {
    return await $api('/search', { query: { q: query } })
  }

  async function getGenres(): Promise<string[]> {
    return await $api('/genres')
  }

  async function getBook(id: number): Promise<Book> {
    return await $api(`/books/${id}`)
  }

  return {
    getMyBooks,
    getMyBookCount,
    getSavedBooks,
    getRecentBooks,
    searchBooks,
    getGenres,
    getBook,
  }
}