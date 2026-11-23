// app/composables/useProfileApi.ts
export const useProfileApi = () => {
  const { $apiAuth } = useNuxtApp()

  async function updateProfile(payload: { name: string; email: string }) {
    return await $apiAuth('/user-update', {
      method: 'PUT',
      body: payload,
    })
  }

  async function deleteAccount() {
    return await $apiAuth('/user-delete', {
      method: 'DELETE',
    })
  }

  return { updateProfile, deleteAccount }
}