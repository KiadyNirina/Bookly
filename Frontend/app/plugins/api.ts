export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')
  const xsrfToken = useCookie('XSRF-TOKEN')

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
      if (xsrfToken.value) {
        options.headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken.value))
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return { provide: { api } }
})