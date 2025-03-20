<script setup>
import { ref, onMounted, defineProps } from "vue";
import apiClient from "@/api";

const props = defineProps({
    userId: Number, // L'ID de l'utilisateur à suivre
});

const isFollowing = ref(false);

// Vérifier si l'utilisateur connecté suit déjà l'utilisateur cible
const checkFollowStatus = async () => {
    try {
        const response = await apiClient.get(`/users/${props.userId}/is-following`);
        isFollowing.value = response.data.isFollowing;
        console.log("Suivre : ".isFollowing)
    } catch (error) {
        console.error("Erreur lors de la vérification du suivi", error);
    }
};

// Suivre ou se désabonner d'un utilisateur
const toggleFollow = async () => {
    try {
        if (isFollowing.value) {
            await apiClient.post(`/users/${props.userId}/unfollow`);
        } else {
            await apiClient.post(`/users/${props.userId}/follow`);
        }
        isFollowing.value = !isFollowing.value; // Inverser l'état
    } catch (error) {
        console.error("Erreur lors du suivi/désabonnement", error);
    }
};

onMounted(checkFollowStatus);
</script>

<template>
    <button
        @click="toggleFollow"
        :class="isFollowing ? 'bg-red-500' : 'bg-blue-500'"
        class="px-4 py-2 text-white rounded"
    >
        {{ isFollowing ? "Se désabonner" : "Suivre" }}
    </button>
</template>