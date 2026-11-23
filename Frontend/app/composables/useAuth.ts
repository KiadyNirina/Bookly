export const useAuth = () => {
  const { $api, $apiSpa, $apiAuth } = useNuxtApp()
  const config = useRuntimeConfig()

  const token = useAuthToken()
  const user = useState<any | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  async function ensureCsrfCookie() {
    await $apiSpa('/sanctum/csrf-cookie', { baseURL: config.public.apiRoot })
  }

  async function login(email: string, password: string) {
    await ensureCsrfCookie()

    const res = await $apiSpa<{ access_token: string }>('/login', {
      method: 'POST',
      body: { email, password },
    })

    if (!res?.access_token) {
      throw new Error('No access_token in login response')
    }

    setAuthTokenCookie(res.access_token)
    token.value = res.access_token

    await fetchUser()
  }

  async function register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) {
    await ensureCsrfCookie()
    await $apiSpa('/register', {
      method: 'POST',
      body: { name, email, password, password_confirmation },
    })
    await login(email, password)
  }

  async function googleLogin(idToken: string) {
    const res = await $api<{ token: string; user: any }>('/google-login', {
      method: 'POST',
      body: { token: idToken },
    })
    setAuthTokenCookie(res.token)
    token.value = res.token
    user.value = res.user
  }

  async function fetchUser() {
    if (!token.value) return null
    try {
      const res = await $api<{ user: any }>('/user')
      user.value = res.user
      return user.value
    } catch {
      return null
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await ensureCsrfCookie()
        await $apiAuth('/logout', { method: 'POST' })
      }
    } finally {
      clearAuthTokenCookie()
      token.value = null
      user.value = null
      await navigateTo('/login')
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    googleLogin,
    login,
    register,
    fetchUser,
    logout,
  }
}