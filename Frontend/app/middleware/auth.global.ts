export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser, user } = useAuth()

  const publicRoutes = ['/login', '/signup', '/']
  if (publicRoutes.includes(to.path)) return

  if (!isAuthenticated.value) {
    return navigateTo('/login', { redirectCode: 302, query: { redirect: to.fullPath } })
  }

  if (!user.value) {
    const fetched = await fetchUser()
    if (!fetched) {
      return navigateTo('/login', { query: { redirect: to.fullPath } })
    }
  }
})