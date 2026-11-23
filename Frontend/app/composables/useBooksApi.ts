export interface Book {
  id: number
  title: string
  author: string
  description: string
  genre: string
  lang: string
  page: number
  picture?: string
  date?: string
  posted_by: number
  created_at?: string
  poster_name?: string
  posted_by_user?: { id: number; name: string }
}

interface PaginatedResponse<T> {
  status: string
  data: {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const useBooksApi = () => {
  const { $api, $apiAuth } = useNuxtApp()

  // --- Lecture (Bearer token) ---

  async function getRecentBooks(page = 1): Promise<PaginatedResponse<Book>['data']> {
    const res = await $api<PaginatedResponse<Book>>('/books/recent', {
      query: { page },
    })
    return res.data
  }

  async function getMyBooks(page = 1): Promise<PaginatedResponse<Book>['data']> {
    const res = await $api<PaginatedResponse<Book>>('/user/books', {
      query: { page },
    })
    return res.data
  }

  async function getMyBookCount(): Promise<number> {
    const res = await $api<{ bookCount: number }>('/user/book/count')
    return res.bookCount
  }

  async function getSavedBooks(userId: number): Promise<Book[]> {
    const res = await $api<{ data: Book[] }>(`/user-saves/${userId}`)
    return res.data ?? []
  }

  async function getGenres(): Promise<string[]> {
    return await $api('/genres')
  }

  async function getBook(id: number): Promise<Book> {
    const res = await $api<{ data: Book }>(`/books/${id}`)
    return res.data
  }

  async function searchBooks(query: string) {
    return await $api<{ books: Book[]; users: any[] }>('/search', {
      query: { q: query },
    })
  }

  // --- Écriture (Bearer + CSRF) ---

  async function createBook(payload: FormData) {
    return await $apiAuth('/createBook', {
      method: 'POST',
      body: payload,
    })
  }

  async function updateBook(id: number, payload: FormData) {
    return await $apiAuth(`/updateBook/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  async function deleteBook(id: number) {
    return await $apiAuth(`/deleteBook/${id}`, { method: 'DELETE' })
  }

  return {
    getRecentBooks,
    getMyBooks,
    getMyBookCount,
    getSavedBooks,
    getGenres,
    getBook,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
  }
}