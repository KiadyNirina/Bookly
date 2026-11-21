export const useAuth = () => {
  const { $api } = useNuxtApp()

  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = useState<any | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const res = await $api<{ access_token: string; token_type: string }>('/login', {
      method: 'POST',
      body: { email, password },
    })
    token.value = res.access_token
  }

  async function register(name: string, email: string, password: string, password_confirmation: string) {
    await $api('/register', {
      method: 'POST',
      body: { name, email, password, password_confirmation },
    })
    await login(email, password)
  }

  async function fetchUser() {
    if (!token.value) return null
    try {
      user.value = await $api('/user')
      return user.value
    } catch {
      token.value = null
      user.value = null
      return null
    }
  }

  async function logout() {
    try {
      if (token.value) await $api('/logout', { method: 'POST' })
    } finally {
      token.value = null
      user.value = null
      await navigateTo('/login')
    }
  }

  return { token, user, isAuthenticated, login, register, fetchUser, logout }
}