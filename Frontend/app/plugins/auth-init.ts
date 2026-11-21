export default defineNuxtPlugin(async () => {
  const { isAuthenticated, user, fetchUser } = useAuth()
  if (isAuthenticated.value && !user.value) {
    await fetchUser()
  }
})