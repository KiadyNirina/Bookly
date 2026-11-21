export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = useState<any | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const config = useRuntimeConfig()

  async function fetchUser() {
    if (!token.value) return null
    try {
      const data = await $fetch(`${config.public.apiBase}/user`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = data
      return data
    } catch {
      token.value = null
      user.value = null
      return null
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await $fetch(`${config.public.apiBase}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` },
        })
      }
    } finally {
      token.value = null
      user.value = null
      await navigateTo('/login')
    }
  }

  return { token, user, isAuthenticated, fetchUser, logout }
}