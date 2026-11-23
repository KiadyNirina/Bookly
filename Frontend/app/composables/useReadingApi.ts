export interface ReadingSession {
  id: number
  current_page: number
  progress_percentage: number
  duration_seconds: number
  last_activity_at?: string
  completed?: boolean
}

export const useReadingApi = () => {
  const { $api, $apiAuth } = useNuxtApp()

  async function startSession(bookId: number): Promise<ReadingSession> {
    const res = await $apiAuth<{ data: ReadingSession }>(`/books/${bookId}/session`, {
      method: 'POST',
    })
    return res.data
  }

  async function resumeSession(bookId: number): Promise<ReadingSession | null> {
    const res = await $api<{ data: ReadingSession | null }>(`/books/${bookId}/resume`)
    return res.data ?? null
  }

  async function updateProgress(
    sessionId: number,
    payload: { current_page: number; time_spent: number; total_pages?: number }
  ) {
    const res = await $apiAuth<{ data: ReadingSession; view_counted: boolean }>(
      `/book-sessions/${sessionId}/progress`,
      { method: 'POST', body: payload }
    )
    return res
  }

  /**
   * URL du PDF streamé (à utiliser dans un <iframe> ou <embed>).
   * Le token étant nécessaire, on ne peut pas passer par une <img src>, il faut
   * soit un blob, soit une requête avec credentials.
   */
  function streamUrl(bookId: number) {
    const config = useRuntimeConfig()
    const token = useAuthToken()
    return `${config.public.apiBase}/books/${bookId}/stream`
  }

  return { startSession, resumeSession, updateProgress, streamUrl }
}