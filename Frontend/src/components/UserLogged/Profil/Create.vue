<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, watch } from 'vue';
import { useUser } from '@/composables/useUser';
import { useFollowers } from '@/composables/useFollowers';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';
import CreateBook from '../Book/createBook.vue';

const { user, isLoggedIn, isUserLoading } = useUser();
const { followersCount, followingCount, fetchFollowersCount, fetchFollowingCount } = useFollowers();
const { books, isLoading, hasMore, error, loadMoreUserBook } = useLoadMoreBooks(4);

const popupVisible = ref(false);

const isActive = (route) => {
  return route === window.location.pathname;
};

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

const create = () => {
  popupVisible.value = true;
};

watch(
  () => user.value,
  (newUser) => {
    if (newUser?.id) {
      fetchFollowersCount(newUser.id);
      fetchFollowingCount(newUser.id);
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadMoreUserBook();
});

</script>

<template>
    <div class="profil mt-6">
        <div class="flex justify-center items-center">
            <h1 class="text-8xl bg-gray-500 w-30 h-30 flex justify-center items-center rounded-full">
                K
            </h1>
        </div>
            <h1 class="text-[35px]">{{ isLoggedIn ? user.name : 'Chargement...' }}</h1>
            <div class="followers">
                <p><b>{{ followersCount ?? 0 }}</b> suivi(e)s</p>
                <p><b>{{ followingCount ?? 0 }}</b> abonnements</p>
            </div>
            <div class="button">
                <button>Partager</button>
                <router-link to="">Modifier le profil</router-link>
            </div>
            <div class="section">
                <a href="/profil/create" :id="isActive('/profil/create') ? 'act-link' : ''">Créees</a>
                <a href="/profil/saved" :id="isActive('/profil/saved') ? 'act-link' : ''">Enregistrées</a>
            </div>

            <div class="button">
                <button id="buttonProfil" @click="create()">Créer</button>
            </div>
            
            <section class="popular-books">
                <div v-if="books.length == 0" class="profil-content">
                    <p>Rien à afficher… pour l’instant ! Les Épingles que vous créez s’installeront ici.</p>
                </div>
                <div v-else class="">
                    <div class="card">
                        <div class="book" v-for="(book, index) in books.slice(0, 4)" :key="index">
                            <a :href="`/books/${book.id}`">
                                <div v-if="(book.isPopular)" class="badge">
                                <div class="popular">
                                    Populaire
                                </div>
                                </div>
                                <div v-else-if="(book.isRecommended)" class="badge">
                                <div class="recommended">
                                    Recommandé
                                </div>
                                </div>
                                <img :src="book.picture ? getImageUrl(book.picture) : getImageUrl(defaultImg)" :alt="book.title" />
                                <p id="type">{{ book.genre }}</p>
                                <div class="book-info">
                                    <h3>{{ book.title }}</h3>
                                    <p>{{ book.author }}</p>
                                    <p id="postedBy">
                                    Publié par <b>{{ user.name }}</b>,<br>
                                    Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                                    Lang : <b>FR</b>
                                    </p>
                                    <div class="content-book">
                                        <div class="note">
                                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" />
                                            <Icon icon="flowbite:star-outline" class="text-[#E67E22]" />
                                        </div>
                                        <span>
                                            <Icon icon="entypo:eye" class="mr-1" />
                                            1,3k
                                        </span>
                                        <span>
                                            <Icon icon="iconamoon:comment-fill" class="mr-1" />
                                            112
                                        </span>
                                        <span>
                                            <Icon icon="ic:round-download" class="mr-1" />  
                                            900
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <router-link to="/books/posted" id="seeMore">Voir plus</router-link>
                </div>
            </section>

            <CreateBook
                :visible="popupVisible"
                @close="popupVisible = false"
            />
    </div>
    
</template>

<style>
.profil{
    font-family: 'Poppins';
    font-size: 12px;
}
.profil-content p{
    display: flex;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    color: white;
    font-family: 'Poppins';
    font-size: 12px;
}
.profil img{
    border: none; 
}
#buttonProfil{
    background-color: #4388ff67;
}
#buttonProfil:hover{
    background-color: #274e9167;
}
</style>