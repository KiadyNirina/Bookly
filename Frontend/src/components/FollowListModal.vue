<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useApi } from '@/composables/useApi'
import { computed } from 'vue'
import FollowButton from './UserLogged/ProfilUser/FollowButton.vue'

const props = defineProps({
  visible: { type: Boolean, required: true },
  userId:  { type: [String, Number], required: true },
  type:    { type: String, default: 'following' }
})

const emit = defineEmits(['close'])

const users = ref([])
const isLoading = ref(false)
const error = ref(null)
const hasMore = ref(false)
const page = ref(1)

const { request } = useApi()

const title = computed(() => {
  return props.type === 'followers' ? 'Abonnés' : 'Abonnements'
})

const fetchList = async (reset = false) => {
  if (reset) {
    page.value = 1
    users.value = []
  }

  if (isLoading.value) return
  isLoading.value = true
  error.value = null

  try {
    const endpoint = props.type === 'followers'
      ? `/users/${props.userId}/followers`
      : `/users/${props.userId}/following`

    const res = await request('GET', `${endpoint}?page=${page.value}&per_page=20`)

    const newUsers = Array.isArray(res) ? res : res.data || []

    users.value = reset ? newUsers : [...users.value, ...newUsers]
    hasMore.value = newUsers.length === 20 
    page.value++
  } catch (err) {
    error.value = "Impossible de charger la liste"
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    fetchList(true) 
  }
})

const loadMore = () => {
  if (hasMore.value && !isLoading.value) {
    fetchList()
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    @click.self="emit('close')"
  >
    <div class="bg-[#1a202c] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b border-white/10">
        <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        <button @click="emit('close')" class="text-white/60 hover:text-white">
          <Icon icon="lucide:x" class="w-6 h-6" />
        </button>
      </div>

      <!-- Contenu -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="error" class="text-red-400 text-center py-6">
          {{ error }}
          <button @click="fetchList(true)" class="mt-3 text-orange-500 hover:underline">
            Réessayer
          </button>
        </div>

        <div v-else-if="isLoading && users.length === 0" class="text-center py-12">
          <Icon icon="eos-icons:loading" class="animate-spin text-4xl text-orange-500 mx-auto" />
        </div>

        <div v-else-if="users.length === 0" class="text-center py-12 text-white/50">
          Aucun {{ title.toLowerCase() }} pour le moment...
        </div>

        <div v-else>
          <div
            v-for="u in users"
            :key="u.id"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div class="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
              {{ u.name?.charAt(0).toUpperCase() || '?' }}
            </div>
            <a :href="`/user/${u.id}/create`" class="flex-1">
              <p class="text-base font-medium text-white">{{ u.name }}</p>
              <p class="text-xs text-white/50">@{{ u.username || 'utilisateur' }}</p>
            </a>
            <FollowButton :user-id="u.id" />
          </div>

          <div v-if="isLoading" class="text-center py-6">
            <Icon icon="eos-icons:loading" class="animate-spin text-orange-500" />
          </div>

          <button
            v-if="hasMore && !isLoading"
            @click="loadMore"
            class="w-full py-4 text-orange-500 hover:text-orange-400 font-medium"
          >
            Voir plus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>