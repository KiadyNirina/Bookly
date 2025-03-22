<script setup>
import { ref, onMounted, defineProps } from "vue";
import api from "@/api";
const props = defineProps({
    userId: Number, // L'ID de l'utilisateur à suivre
});

const isFollowing = ref(false);

// Vérifier si l'utilisateur connecté suit déjà l'utilisateur cible
const checkFollowStatus = async () => {
    try {
        const response = await api.checkFollow(props.userId);
        isFollowing.value = response.data.isFollowing;
        console.log("Suivi vérifié :", isFollowing.value);
    } catch (error) {
        console.error("Erreur lors de la vérification du suivi", error);
    }
};

// Suivre ou se désabonner d'un utilisateur
const toggleFollow = async () => {
    try {
        if (isFollowing.value) {
            await api.unfollowUser(props.userId);
            isFollowing.value = false;
            console.log("Désabonné");
        } else {
            await api.followUser(props.userId);
            isFollowing.value = true;
            console.log("Abonné");
        }
    } catch (error) {
        console.error("Erreur lors du suivi/désabonnement", error);
    }
};

onMounted(checkFollowStatus);
</script>

<template>
    <div class="button">
        <button
            @click="toggleFollow"
            :id="isFollowing ? 'isFollow' : 'isNotFollow'"
        >
            {{ isFollowing ? "Se désabonner" : "S'abonner" }}
        </button>
    </div>
</template>

<style>
#isFollow{
    background: rgba(255, 255, 255, 0.253);
}

#isFollow:hover {
    background: rgb(128, 128, 128);
    cursor: pointer;
}

#isNotFollow {
    background-color: #E67E22;
    border: 2px solid #E67E22;
    border-radius: 30px;
    transition: 0.5s;
}

#isNotFollow:hover {
    background-color: transparent;
    color: #E67E22;
    cursor: pointer;
}
</style>