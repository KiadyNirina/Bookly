<script>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '@/composables/useBook'
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser'
import Swal from 'sweetalert2'

export default {
    components: {
        Icon
    },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { user, isLoggedIn } = useUser()
    
    // États du livre courant
    const { 
      book: currentBook, 
      isLoading: isBookLoading, 
      error: bookError, 
      fetchBook, 
      deleteBook 
    } = useBook()
    
    // États des livres similaires
    const { 
      books: similarBooks, 
      isLoading: areBooksLoading, 
      hasMore: hasMoreBooks, 
      loadMore: loadMoreBooks 
    } = useLoadMoreBooks(5)
    
    // États de l'évaluation
    const hoveredStar = ref(0)
    const selectedRating = ref(0)
    const starIcons = {
      filled: 'flowbite:star-solid',
      empty: 'flowbite:star-outline'
    }

    // Chargement initial
    onMounted(async () => {
      await fetchBook(route.params.id)
      await loadMoreBooks()
    })

    // Gestion de la suppression
    const handleDeleteBook = async (bookId) => {
      const success = await deleteBook(bookId)
      if (success) {
        similarBooks.value = similarBooks.value.filter(book => book.id !== bookId)
      }
    }

    // Gestion de l'évaluation
    const handleStarHover = (star) => hoveredStar.value = star
    const handleRatingSelection = (star) => {
      selectedRating.value = star
      Swal.fire({
        title: 'Merci !',
        text: `Vous avez donné une note de ${star} étoiles.`,
        icon: 'success',
        confirmButtonText: 'OK',
      })
    }

    // Utilitaires
    const truncateText = (text = '', max = 100) => 
      text.length > max ? `${text.slice(0, max)}...` : text

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const options = { day: '2-digit', month: 'long', year: 'numeric' }
      return new Date(dateString).toLocaleDateString('fr-FR', options)
    }

    const getImageUrl = (imgPath) => 
      imgPath ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/'}${imgPath}` 
              : '/default-book-cover.jpg'

    return {
      isLoggedIn,
      user,
      
      // Livre courant
      currentBook,
      isBookLoading,
      bookError,
      
      // Livres similaires
      similarBooks,
      areBooksLoading,
      hasMoreBooks,
      loadMoreBooks,
      
      // Évaluation
      hoveredStar,
      selectedRating,
      starIcons,
      
      // Méthodes
      handleDeleteBook,
      handleStarHover,
      handleRatingSelection,
      truncateText,
      formatDate,
      getImageUrl
    }
  }
}
</script>

<template>
    <div class="content-page">
        <div class="tri">
            <a href="">Romance</a>
            <a href="">Fantaisie</a>
            <a href="">Histoire</a>
            <a href="">Fiction</a>
            <a href="">Non fiction</a>
            <a href="">Comédie</a>
            <a href="">Action</a>
        </div>

        <div v-if="currentBook" class="one">
            <div class="sect1">
                <div class="img">
                    <img :src="getImageUrl(currentBook.picture)" :alt="currentBook.title" />
                </div>
                <div class="info">
                    <h3>{{ currentBook.title }}</h3>
                    <p>Ecrit par <b>{{ currentBook.author }}</b></p>
                    <p id="type">Romance</p>
                    <p id="poste">
                        Publié par <b>
                            <a v-if="isLoggedIn && currentBook.posted_by.name == user.name" href="/profil/create">
                                {{ currentBook.posted_by.name }}
                            </a>
                            <a v-else :href="`/user/${currentBook.posted_by.id}/create`">
                                {{ currentBook.posted_by.name }}
                            </a>
                        </b>,<br>
                        Le <b>{{ formatDate(currentBook.created_at) }}</b>,<br>
                        Lang : <b>{{ currentBook.lang }}</b><br>
                        Page : <b>{{ currentBook.page }}</b>
                    </p>
                    <div class="content-book">
                        <div class="note">
                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" height="20" />
                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" height="20" />
                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" height="20" />
                            <Icon icon="flowbite:star-solid" class="text-[#E67E22]" height="20" />
                            <Icon icon="flowbite:star-outline" class="text-[#E67E22]" height="20" />
                            <span><i>(100 notes)</i></span>
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
            </div>

            <div class="desc">
                <div class="rating">
                    <Icon :icon="star <= hoveredStar || star <= selectedRating ? starIcons.filled : starIcons.empty" v-for="star in 5"
                        :key="star"
                        alt="star"
                        @mouseover="handleStarHover(star)"
                        @mouseleave="handleStarHover(0)"
                        @click="handleRatingSelection(star)" 
                        class="text-[#E67E22]" 
                        height="40" 
                    />
                </div>
                
                <h2>Description</h2>
                <p v-html="currentBook.description.replace(/\n/g, '<br>')"></p>
                <div class="action">
                    <router-link :to="`/book/${currentBook.id}/file`">
                        <Icon icon="ant-design:read-filled" class="mr-1" />Lire
                    </router-link>  
                    <a href="#save">
                        <Icon icon="stash:save-ribbon" class="mr-1" />Enregistrer
                    </a>
                    <a href="#download">
                        <Icon icon="ic:round-download" class="mr-1" />  Télécharger
                    </a>
                    <a href="#download">
                        <Icon icon="mage:share-fill" class="mr-1" />Partager
                    </a>
                </div>
                <form v-if="isAuthenticated" action="">
                    <img id="profil" src="../../../../public/cover 2.jpg" alt="">
                    <textarea name="" id="" placeholder="Donnez votre avis..."></textarea>
                    <button><img src="../../../../public/icons/send.png" alt=""></button>
                </form>
                <span id="avis">99 avis</span>
                <div class="avis">
                    <div class="profile">
                        <img src="../../../../public/cover 4.jfif" alt="">
                        <div class="coms">
                            <b><a href="">Nom</a></b>
                            <p><span> Le <b>15/02/2024</b></span>,<br>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                            <span class="answer">
                                2mois 
                                <b class="mr-5 ml-5">Répondre</b> 
                                <Icon icon="solar:like-broken" class="mr-1"/>
                                <b>2</b>
                            </span>
                        </div>
                    </div>
                    <div class="profile">
                        <img src="../../../../public/cover 4.jfif" alt="">
                        <div class="coms">
                            <b><a href="">Nom</a></b>
                            <p><span> Le <b>15/02/2024</b></span>,<br>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                            <span class="answer">
                                2mois 
                                <b class="mr-5 ml-5">Répondre</b> 
                                <Icon icon="solar:like-broken" class="mr-1"/>
                                <b>2</b>
                            </span>
                        </div>
                    </div>
                    <div class="profile">
                        <img src="../../../../public/cover 4.jfif" alt="">
                        <div class="coms">
                            <b><a href="">Nom</a></b>
                            <p><span> Le <b>15/02/2024</b></span>,<br>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                            <span class="answer">
                                2mois 
                                <b class="mr-5 ml-5">Répondre</b> 
                                <Icon icon="solar:like-broken" class="mr-1"/>
                                <b>2</b>
                            </span>
                        </div>
                    </div>
                    <div class="profile">
                        <img src="../../../../public/cover 4.jfif" alt="">
                        <div class="coms">
                            <b><a href="">Nom</a></b>
                            <p><span> Le <b>15/02/2024</b></span>,<br>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                            <span class="answer">
                                2mois 
                                <b class="mr-5 ml-5">Répondre</b> 
                                <Icon icon="solar:like-broken" class="mr-1"/>
                                <b>2</b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Livre non trouvé</p>
        </div>

        <section class="popular-books">
            <h2>Les Livres Similaires</h2>

            <div v-if="similarBooks.length > 0" class="row">
                <div class="books" v-for="(bk, index) in similarBooks" :key="index">
                    <a v-if="bk.id != currentBook?.id" :href="`/books/${bk.id}`">
                        <div class="img">
                            <img :src="getImageUrl(bk.picture)" :alt="bk.title" />
                        </div>
                        <div class="info">
                            <h3>{{ bk.title }}</h3>
                            <p>{{ bk.author }}</p>
                            <p id="poste">
                                Publié par <b>{{ bk.posted_by.name }}</b>,<br>
                                Le <b>{{ formatDate(bk.created_at) }}</b>,<br>
                                Lang : <b>{{ bk.lang }}</b>
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
                        <div class="desc">
                            <p id="type" class="rounded-tr-lg">{{ bk.genre }}</p>
                            <p v-html="truncateText((bk.description.replace(/\n/g, '<br>')), 200)"></p>
                            <div class="action">
                                <a href="#save" class="actionButton">
                                    <Icon icon="stash:save-ribbon" />
                                </a>
                                <a v-if="user && bk.posted_by.name === user.name" href="#save" class="actionButton">
                                    <Icon icon="material-symbols:edit" />
                                </a>
                                <a v-if="user && bk.posted_by.name === user.name" href="#delete" 
                                   @click.prevent="handleDeleteBook(bk.id)" 
                                   class="actionButton">
                                   <Icon icon="ic:round-delete" />
                                </a>
                                <a href="#download" class="actionButton">
                                    <Icon icon="mage:share-fill" class="mr-1" />
                                </a>
                            </div>
                        </div>
                    </a>
                </div>
                <button v-if="hasMoreBooks" @click="loadMoreBooks" id="seeMore">{{ !areBooksLoading ? 'Voir Plus' : 'Chargement' }}</button>
            </div>
            <div v-else class="">
                <p style="font-size: 12px;">Aucun livre similaire trouvé</p>
            </div>
        </section>
    </div>
</template>

<style>
@font-face {
    font-family: 'Poppins';
    src: url('../../../../public/font/Poppins/Poppins-Light.ttf');
}
.one{
    border: 1px solid #4388ff27;
    box-shadow: 0px 0px 10px #4388ff2b;
    border-radius: 20px;
    display: flex;
    margin-top: 25px;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
}
.one .sect1{
    width: 50%;
}
.one .sect1 .img img{
    width: 100%;
    height: 400px;
    border-radius: 20px 0 0 0;
    object-fit: cover;
}
.one .sect1 .info {
    padding: 20px;
}
.one .sect1 .info h3{
    font-size: 30px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    text-transform: uppercase;
    color: #4388ff;
    margin-bottom: 0;
    margin-top: 0;
}
.one .sect1 .info p{
    color: rgba(255, 255, 255, 0.545);
    margin: 0;
    font-size: 15px;
    font-family: 'Poppins';
}
.one .sect1 .info #type{
    margin-top: 20px;
    font-size: 20px;
    text-decoration: none;
    background-color: #4388ff28;
    color: #FAFAFA;
    text-transform: uppercase;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: bold;
    font-style: italic;
    text-align: center
}
.one .sect1 .info .content-book{
    padding: 0;
}
.one .sect1 .info .content-book span{
    font-size: 15px;
}
.one .sect1 .info img{
    height: 20px;
    margin-right: 5px;
}
.one .sect1 .info .note img{
    height: 20px;
}
.one .desc{
    width: 50%;
    padding: 20px;
}
.one .desc h2{
    margin: 0;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.one .desc p{
    font-family: 'Poppins';
    color: rgba(255, 255, 255, 0.57);
    height: 230px;
    overflow-y: auto;
    font-size: 13px;
    line-height: 20px;
}
.one .desc .action{
    display: flex;
}
.one .desc .action a{
    padding: 10px;
    border-radius: 20px;
    display: flex;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.842);
    font-weight: bold;
    font-size: 15px;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.one .desc .action img{
    height: 20px;
    margin-right: 5px;
}
.one .desc .action a:hover{
    background-color: rgba(128, 128, 128, 0.197);
}
.one .desc form{
    display: flex;
    margin-top: 10px;
}
#profil{
    height: 50px;
    width: 50px;
    object-fit: cover;
    border-radius: 100%;
    margin-right: 2px;
}
.one .desc form textarea{
    width: 100%;
    background-color: transparent;
    border-radius: 30px;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.093);
    font-family: 'Courier New', Courier, monospace;
    padding: 10px;
}
.one .desc form button{
    background-color: transparent;
    border: none;
    border-radius: 30px;
}
.one .desc form button:hover{
    background-color: rgba(128, 128, 128, 0.197);
    cursor: pointer;
}
.one .desc form button img{
    height: 30px;
}
.one .desc .avis{
    max-height: 300px;
    overflow-y: auto;
}
.one .desc .avis .profile{
    display: flex;
    margin-top: 10px;
}
.one .desc .avis .profile img{
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 100%;
    border: 1px solid rgba(255, 255, 255, 0.334);
    padding: 2px;
}
.one .desc .avis .profile .coms{
    background-color: rgba(255, 255, 255, 0.081);
    margin-left: 5px;
    padding: 10px;
    border-radius: 20px;
}
.one .desc .avis .profile .coms b{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.one .desc .avis .profile .coms a{
    text-decoration: none;
    color: white;
}
.one .desc .avis .profile .coms span{
    font-size: 12px;
}
.one .desc .avis .profile .coms p{
    height: auto;
    font-family: 'Poppins';
}
.one .desc .avis .profile .coms .answer{
    margin-top: 5px;
    display: flex;
    align-items: center;
    color: #AAAAAA;
    font-family: 'Poppins';
}

#avis{
    color: rgb(201, 201, 201);
    font-size: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.rating {
  display: flex;
  cursor: pointer;
}

.rating img{
    height: 40px;
}

.star {
  font-size: 20px; 
  color: #ccc; 
  transition: color 0.3s; 
  margin-bottom: 10px;
}

.star.active {
  color: gold;
}
.swal2-popup {
  background-color: #030311 !important;
  color: #ffffff !important; 
}

</style>