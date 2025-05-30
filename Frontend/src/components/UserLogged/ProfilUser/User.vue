<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, watch } from 'vue';
import { useUser } from '@/composables/useUser';
import { useRoute } from 'vue-router';
import { useFollowers } from '@/composables/useFollowers';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';
import FollowButton from './FollowButton.vue';

const { userOne, fetchOneUser } = useUser();
const { followersCount, followingCount, fetchFollowersCount, fetchFollowingCount } = useFollowers();
const { books, isLoading, hasMore, error, loadMoreBooks } = useLoadMoreBooks(4);

const route = useRoute();
const idUser = route.params.id;

const isActive = (linkPath) => route.path === linkPath;

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

watch(
    () => userOne.value,
    (newUser) => {
        if (newUser?.id) {
            fetchFollowersCount(newUser.id);
            fetchFollowingCount(newUser.id);
        }
    },
    { immediate: true }
);

onMounted(() => {
    fetchOneUser(idUser);
    loadMoreBooks(idUser);
});
</script>

<template>
    <div class="profil mt-6">
        <div class="flex justify-center items-center">
            <h1 class="text-8xl bg-gray-500 w-30 h-30 flex justify-center items-center rounded-full">
                K
            </h1>
        </div>
            <h1 class="text-[35px]">{{ userOne ? userOne.name : 'Chargement...' }}</h1>
            <div class="followers">
                <p><b>{{ followersCount ?? 0 }}</b> suivi(e)s</p>
                <p><b>{{ followingCount ?? 0 }}</b> abonnements</p>
            </div>
            <div class="button">
                <button>Partager</button>
                <router-link to="">Modifier le profil</router-link>
            </div>
            <FollowButton v-if="userOne" :userId="userOne.id" />
            <div class="section" v-if="userOne">
                <a :href="`/user/${userOne.id}/create`" :id="isActive(`/user/${userOne.id}/create`) ? 'act-link' : ''">Créees</a>
                <a :href="`/user/${userOne.id}/saved`" :id="isActive(`/user/${userOne.id}/saved`) ? 'act-link' : ''">Enregistrées</a>
            </div>
            
            <section class="popular-books">
                <div v-if="books.length == 0" class="profil-content">
                    <p>Rien à afficher… pour l’instant ! Les Épingles que vous créez s’installeront ici.</p>
                </div>
                <div v-else class="">
                    <div class="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
                        <a :href="`/books/${book.id}`" class="border-1 border-[#4388ff27] rounded-2xl transition duration-200 hover:shadow-[0_0_10px_#3355ffc2]" v-for="book in books" :key="book.id">
                        <img style="height: 200px; width: 100%; object-fit: cover;" class="rounded-t-2xl" :src="getImageUrl(book.picture)" :alt="book.title">
                        <p id="type">{{ book.genre }}</p>
                        <div class="book-info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="postedBy">
                            Publié par <b>{{ userOne.name }}</b>,<br>
                            Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                            Lang : <b>FR</b>
                            </p>
                            <div class="flex justify-between items-center text-sm mt-3 text-gray-500">
                                <div class="flex items-center gap-1 text-[#E67E22]">
                                    <Icon icon="flowbite:star-solid" v-for="i in 4" :key="i" />
                                    <Icon icon="flowbite:star-outline" />
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="flex items-center">
                                    <Icon icon="entypo:eye" class="mr-1" /> 1,3k
                                    </span>
                                    <span class="flex items-center">
                                    <Icon icon="iconamoon:comment-fill" class="mr-1" /> 112
                                    </span>
                                    <span class="flex items-center">
                                    <Icon icon="ic:round-download" class="mr-1" /> 900
                                    </span>
                                </div>
                            </div>
                        </div>
                        </a>
                    </div>
                    <button
                        v-if="hasMore && books.length > 0"
                        @click="loadMoreBooks(userOne.id)"
                        :disabled="isLoading"
                        id="seeMore"
                        >
                            {{ isLoading ? 'Chargement...' : 'Voir plus' }}
                    </button>
                </div>
            </section>
    </div>
</template>

<style>
.profil{
    margin-left: auto;
    margin-right: auto;
    max-width: 1300px;
    justify-content: center;
    padding: 50px;
}
#pdp {
    color: white;
    font-size: 50px;
    text-align: center;
    background: rgba(255, 255, 255, 0.253);
    padding: 20px;
    width: 60px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 100%;
}
.profil h1{
    text-align: center;
    color: white;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.profil img{
    height: 120px;
    border: 1px solid white;
    /*border-radius: 100%;*/
    display: flex;
    margin-left: auto;
    margin-right: auto;
}
.followers{
    display: flex;
    justify-content: center;
}
.followers p{
    color: white;
    margin: 10px;
}
.section{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.section a{
    padding: 10px;
    color: white;
    text-decoration: none;
}
.section a:hover{
    background-color: rgba(255, 255, 255, 0.1);
}
#act-link{
    color: #E67E22;
    border-bottom: 1px solid #E67E22;
}
</style>