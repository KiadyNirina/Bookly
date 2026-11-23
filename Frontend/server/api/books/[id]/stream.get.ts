export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const res = await $fetch.raw(`${config.public.apiBase}/books/${id}/stream`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    },
    responseType: 'arrayBuffer',
  })

  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
  })
  return res._data
})