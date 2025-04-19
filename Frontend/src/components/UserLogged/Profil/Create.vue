<script setup>
import { ref, onMounted } from 'vue';
import { useUser } from '@/composables/useUser';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';
import CreateBook from '../Book/createBook.vue';

const { user, isLoggedIn, isUserLoading } = useUser();
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

onMounted(() => {
  loadMoreUserBook();
});


// export default {
//     mixins: [userMixin],
//     components: { 
//         CreateBook,
//     },
//     data() {
//         return {
//             popupVisible: false,
//             followers: null,
//             following: null,
//             user: null,
//         }
//     },
//     methods: {
//         isActive(route) {
//             return this.$route.path === route;
//         },
//         create() {
//             this.popupVisible = true; // Affiche le popup
//         },
//         formatDate(dateString) {
//             const options = { day: '2-digit', month: 'long', year: 'numeric' };
//             const date = new Date(dateString);
//             return date.toLocaleDateString('fr-FR', options);
//         },
//         async getFollowersCount() {
//             try{
//                 if(this.user){
//                     const response = await api.followersCount(this.user.id);
//                     this.followers = response.data;
//                     if(this.followers > 999) {
//                         this.followers = Math.floor(this.followers / 1000) + 'k'; // Convertit en milliers
//                     }
//                 }
//             } catch (error) {
//                 console.error("Erreur lors de la récupération du nombre de followers", error);
//             }
//         },
//         async getFollowingCount() {
//             try {
//                 if(this.user) {
//                     const response = await api.followingCount(this.user.id);
//                     this.following = response.data;
//                     if(this.following > 999) {
//                         this.following = Math.floor(this.following / 1000) + 'k'; // Convertit en milliers
//                     }
//                 }
//             } catch (error) {
//                 console.error("Erreur lors de la récupération du nombre de following", error);
//             }
//         },
//     },
//     async created() {
//         await this.$nextTick();
//         await this.getFollowersCount();
//         await this.getFollowingCount();
//     },
//     watch: {
//         // On surveille les changements de user
//         'user'(newVal) {
//             if(newVal) {
//                 this.getFollowersCount();
//                 this.getFollowingCount();
//             }
//         },
//     }
// };
</script>

<template>
    <div class="profil">
        <h1 id="pdp">K</h1>
            <h1>{{ isLoggedIn ? user.name : 'Chargement...' }}</h1>
            <div class="followers">
                <p><b>{{ followers ?? 0 }}</b> suivi(e)s</p>
                <p><b>{{ following ?? 0 }}</b> abonnements</p>
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
                                        <img src="../../../../public/icons/note-active.png" alt="">
                                        <img src="../../../../public/icons/note-active.png" alt="">
                                        <img src="../../../../public/icons/note-active.png" alt="">
                                        <img src="../../../../public/icons/note-active.png" alt="">
                                        <img src="../../../../public/icons/note.png" alt="">
                                    </div>
                                    <span>👀1,3k</span>
                                    <span><img src="../../../../public/icons/coms.png" alt=""> 112</span>
                                    <span><img src="../../../../public/icons/download.png" alt=""> 900</span>
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
.profil-content p{
    display: flex;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    color: white;
    font-family: 'Poppins';
    font-size: 12px;
}
#buttonProfil{
    background-color: #4388ff67;
}
#buttonProfil:hover{
    background-color: #274e9167;
}
</style>