export const useProfileApi = () => {
  const { $api } = useNuxtApp()

  async function updateProfile(payload: { name: string; email: string }) {
    return await $api('/user-update', {
      method: 'PUT',
      body: payload,
    })
  }

  async function deleteAccount() {
    return await $api('/user-delete', {
      method: 'DELETE',
    })
  }

  return { updateProfile, deleteAccount }
}