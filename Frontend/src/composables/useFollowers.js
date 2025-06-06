import { ref } from 'vue'
import { useApi } from './useApi'

export function useFollowers() {
  const { request } = useApi()
  const followersCount = ref(0)
  const followingCount = ref(0)
  const error = ref(null)

  const fetchFollowersCount = async (userId) => {
    error.value = null

    try {
      const response = await request('GET',`/users/${userId}/followers/count`)
      if(response > 999){
        followersCount.value = `${Math.floor(response / 1000)}k`
      } else {
        followersCount.value = response
      }
    } catch (err) {
      console.error(err.message || 'Erreur lors du chargement des followers.')
    }
  }

  const fetchFollowingCount = async (userId) => {
    error.value = null
    try {
      const response = await request('GET',`/users/${userId}/following/count`)
      if(response > 999){
        followingCount.value = `${Math.floor(response / 1000)}k`
      } else {
        followingCount.value = response
      }
    } catch (err) {
      console.error(err.message || 'Erreur lors du chargement des followers.')
    }
  }

  return {
    followersCount,
    followingCount,
    error,
    fetchFollowersCount,
    fetchFollowingCount
  }
}
