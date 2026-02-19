<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import apiClient from '@/plugins/axios'

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})

const isFollowing = ref(false)
const isFollowedBy = ref(false)
const isLoading = ref(false)
const errorMessage = ref(null)

const buttonText = computed(() => {
  if (isLoading.value) return 'Chargement...'

  if (isFollowing.value) {
    return 'Abonné'
  }

  if (isFollowedBy.value) {
    return 'Suivre en retour'
  }

  return 'Suivre'
})

const buttonClasses = computed(() => {
  const base = 'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-60 shadow-sm'

  if (isLoading.value) {
    return `${base} bg-gray-700 text-gray-300 cursor-wait`
  }

  if (isFollowing.value) {
    return `${base} bg-transparent border border-orange-500/70 hover:border-red-500/70 text-orange-400 hover:text-red-400`
  }

  return `${base} bg-orange-500 hover:bg-orange-600 text-white`
})

async function toggleFollow() {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = null

  const willFollowNow = !isFollowing.value
  const endpoint = willFollowNow
    ? `/users/${props.userId}/follow`
    : `/users/${props.userId}/unfollow`

  try {
    const response = await apiClient.post(endpoint)
    console.log('Succès follow/unfollow :', response.data.message)
    isFollowing.value = willFollowNow
  } catch (err) {
    console.error('Erreur follow/unfollow :', err)

    if (err.response?.status === 401) {
      errorMessage.value = "Veuillez vous connecter pour suivre cet auteur"
    } else if (err.response?.status === 404) {
      errorMessage.value = "Utilisateur introuvable"
    } else {
      errorMessage.value = err.response?.data?.message || "Une erreur est survenue"
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (!props.userId) {
    errorMessage.value = "ID utilisateur manquant"
    return
  }

  isLoading.value = true
  try {
    const res = await apiClient.get(`/users/${props.userId}/follow-status`)
    
    isFollowing.value  = res.data.isFollowing  === true
    isFollowedBy.value = res.data.isFollowedBy === true

    console.log('Relation:', { 
      je_le_suis: isFollowing.value, 
      il_me_suit: isFollowedBy.value 
    })
  } catch (err) {
    console.error('Erreur follow-status:', err)
    if (err.response?.status === 401) {
      errorMessage.value = "Connectez-vous pour voir l'état"
    } else {
      errorMessage.value = "Impossible de vérifier la relation"
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="relative inline-block">
    <button
      :class="buttonClasses"
      :disabled="isLoading"
      @click="toggleFollow"
    >
      <Icon
        v-if="isLoading"
        icon="eos-icons:loading"
        class="animate-spin w-4 h-4"
      />
      <Icon
        v-else-if="isFollowing"
        icon="lucide:user-check"
        class="w-4 h-4"
      />
      <Icon
        v-else
        icon="lucide:user-plus"
        class="w-4 h-4"
      />

      {{ buttonText }}
    </button>

    <p
      v-if="errorMessage"
      class="text-red-400 text-xs mt-1.5 absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>