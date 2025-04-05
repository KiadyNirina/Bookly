<script>
// import api from '@/api';
// import FollowButton from './FollowButton.vue';

// export default {
//     data() {
//         return {
//             userOne: null,
//             FollowersCount: null,
//             FollowingCount: null,
//             userSelectedBooks: [],
//             currentPageUserSelected: 1,
//             lastPageUserSelected: 1,
//             perPageUserSelected: 4,
//             defaultImg: '/path/to/default/image.jpg', // À remplacer par une image par défaut
//         }
//     },
//     components: {
//         FollowButton,
//     },
//     methods: {
//         isActive(route) {
//             return this.$route.path === route;
//         },
//         async getUserOne() {
//             try {
//                 const idUser = this.$route.params.id;
//                 const response = await api.getOneUser(idUser);
//                 this.userOne = response.data.data;
//                 console.log("Utilisateur récupéré :", this.userOne);
//             } catch (error) {
//                 console.error("Erreur de récupération des données de l'utilisateur :", error);
//             }
//         },
//         async getSelectedUserBooks() {
//             try {
//                 const idUser = this.$route.params.id;
//                 const response = await api.getUserSelectedBooks(idUser, this.currentPageUserSelected, this.perPageUserSelected);
//                 this.userSelectedBooks = response.data.data;
//                 console.log("Livres récupérés : ", this.userSelectedBooks);
//             } catch (error) {
//                 console.error("Erreur de récupération des livres de l'utilisateur sélectionné :", error.message);
//             }
//         },
//         async getFollowersNumber() {
//             try {
//                 const idUser = this.$route.params.id;
//                 const response = await api.followersCount(idUser);
//                 this.FollowersCount = response.data;
//             } catch (error) {
//                 console.error("Erreur lors de récupération de nombre de suivi");
//             }
//         },
//         async getFollowingNumber() {
//             try {
//                 const idUser = this.$route.params.id;
//                 const response = await api.followingCount(idUser);
//                 this.FollowingCount = response.data;
//             } catch (error) {
//                 console.error("Erreur lors de récupération de nombre de suivi");
//             }
//         },
//         getImageUrl(imagePath) {
//             return imagePath ? `/uploads/${imagePath}` : this.defaultImg;
//         },
//         formatDate(date) {
//             return new Date(date).toLocaleDateString('fr-FR');
//         }
//     },
//     created() {
//         this.getUserOne();
//         this.getSelectedUserBooks();
//         this.getFollowersNumber();
//         this.getFollowingNumber();
//     }
// };
</script>

<template>
    <!-- <div v-if="userOne" class="profil">
        <h1 id="pdp">K</h1>
        <h1>{{ userOne.name }}</h1>
        <div class="followers">
            <p><b>{{ FollowersCount }}</b> suivi(e)s</p>
            <p><b>{{ FollowingCount }}</b> abonnements</p>
        </div>
        <FollowButton v-if="userOne" :userId="userOne.id" />
        <div class="section">
            <a :href="`/user/${userOne.id}/create`" :id="isActive(`/user/${userOne.id}/create`) ? 'act-link' : ''">Créées</a>
            <a :href="`/user/${userOne.id}/saved`" :id="isActive(`/user/${userOne.id}/saved`) ? 'act-link' : ''">Enregistrées</a>
        </div>

        <div class="popular-books">
            <div v-if="userSelectedBooks.length === 0" class="profil-content">
                <p>Rien à afficher… pour l’instant ! Les Épingles que {{ userOne.name }} crée s’afficheront ici.</p>
            </div>
            <div v-else>
                <div class="card">
                    <div class="book" v-for="book in userSelectedBooks.slice(0, 4)" :key="book.id">
                        <a :href="`/books/${book.id}`">
                            <div v-if="book.isPopular" class="badge">
                                <div class="popular">Populaire</div>
                            </div>
                            <div v-else-if="book.isRecommended" class="badge">
                                <div class="recommended">Recommandé</div>
                            </div>
                            <img :src="getImageUrl(book.picture)" :alt="book.title" />
                            <p id="type">Fiction</p>
                            <div class="book-info">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                                <p id="postedBy">
                                    Publié par <b>{{ userOne.name }}</b>,<br>
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
        </div>
    </div>
    <div v-else class="profil">
        <h1 id="pdp">K</h1>
        <h1>Chargement...</h1>
        <div class="followers">
            <p><b>0</b> suivi(e)s</p>
            <p><b>0</b> abonnements</p>
        </div>
        <div class="button">
            <button>S'abonner</button>
        </div>
    </div> -->
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
    font-size: 35px;
}
.profil img{
    height: 120px;
    border: 1px solid white;
    border-radius: 100%;
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