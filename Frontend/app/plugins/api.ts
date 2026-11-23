export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // Instance SPA : CSRF + cookies de session (login, register, csrf-cookie)
  const apiSpa = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      const xsrfToken = useCookie('XSRF-TOKEN')
      if (xsrfToken.value) {
        options.headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken.value))
      }
    },
  })

  // Instance Bearer : routes protégées (user, logout, ...)
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      const token = useAuthToken()
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        clearAuthTokenCookie()
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  const apiAuth = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      const token = useAuthToken()
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
      const xsrfToken = useCookie('XSRF-TOKEN')
      if (xsrfToken.value) {
        options.headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken.value))
      }
    },
  })

  return { provide: { api, apiSpa, apiAuth } }
})