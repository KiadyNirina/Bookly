const COOKIE_NAME = 'auth_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

export const useAuthToken = () =>
  useCookie<string | null>(COOKIE_NAME, {
    maxAge: MAX_AGE,
    sameSite: 'lax',
    secure: false,
    path: '/',
  })

export function setAuthTokenCookie(token: string) {
  if (!import.meta.client) return
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE}; samesite=lax`
}

export function clearAuthTokenCookie() {
  if (!import.meta.client) return
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
}