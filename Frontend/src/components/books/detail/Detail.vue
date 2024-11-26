<script>
//import AlertPopup from './AlertPopup.vue';
import Swal from 'sweetalert2';

export default {
    //components: { AlertPopup },
    data() {
        return {
            isAuthenticated: false,
            books: [
                { title: 'A travers la fenêtre', author: 'Christophe RABEARIMANANA', postedBy: 'John Doe', date: '19/05/2023', cover: '../../public/cover 1.jpg', isPopular: true, type: 'Romance' },
                { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', postedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 2.jpg', isRecommended: true, type: 'Fiction' },
                { title: 'Titre du Livre 1', author: 'Auteur 1', postedBy: 'John Doe', date: '22/06/2024', cover: '../../public/cover 3.jpg', isPopular: true, type: 'Fantaisie' },
                { title: 'Titre du Livre 2', author: 'Auteur 2', postedBy: 'John Doe', date: '16/10/2024', cover: '../../public/cover 4.jfif', isRecommended: true , type: 'Fiction'},
            ],
            hoveredStar: 0, 
            selectedRating: 0, 
            filledStar: '/icons/note-active.png',
            emptyStar: '/icons/note.png', 
            popupVisible: false,
        };
    },
    created() {
        this.checkAuth();
    },
    methods: {
        isActive(route) {
            return this.$route.path === route;
        },
        checkAuth() {
            this.isAuthenticated = !!localStorage.getItem('token');
        },
        hoverStar(star) {
            this.hoveredStar = star; 
        },
        selectRating(star) {
            this.selectedRating = star;
            //this.popupVisible = true;
            Swal.fire({
            title: 'Merci !',
            text: `Vous avez donné une note de ${star} étoiles.`,
            icon: 'success',
            confirmButtonText: 'OK',
            }); 
        },
    },
    watch: {
        '$route'() {
            this.checkAuth();
        }
    }
};
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

        <div class="one">
                    <div class="sect1">
                        <div class="img">
                            <img src="../../../../public/cover 3.jpg" alt="">
                        </div>
                        <div class="info">
                            <h3>Titre</h3>
                            <p>Ecrit par <b>John Doe</b></p>
                            <p id="type">Romance</p>
                            <p id="poste">
                            Publié par <b>John Doe</b>,<br>
                            Le <b>10/10/2024</b>,<br>
                            Lang : <b>FR</b><br>
                            Page : <b>122</b>
                            </p>
                            <div class="content-book">
                                <div class="note">
                                    <img src="../../../../public/icons/note-active.png" alt="">
                                    <img src="../../../../public/icons/note-active.png" alt="">
                                    <img src="../../../../public/icons/note-active.png" alt="">
                                    <img src="../../../../public/icons/note-active.png" alt="">
                                    <img src="../../../../public/icons/note.png" alt="">
                                </div>
                                <span><img src="../../../../public/icons/oeil.png" alt=""> 1,3k</span>
                                <span><img src="../../../../public/icons/coms.png" alt="">150</span>
                                <span><img src="../../../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </div>

                    <div class="desc">
                        <div class="rating">
                            <img
                                v-for="star in 5"
                                :key="star"
                                :src="star <= hoveredStar || star <= selectedRating ? filledStar : emptyStar"
                                alt="star"
                                class="star"
                                @mouseover="hoverStar(star)"
                                @mouseleave="hoverStar(0)"
                                @click="selectRating(star)"
                             />
                        </div>

                        <!-- <AlertPopup
                            :message="'Merci pour votre note de ' + selectedRating + ' étoiles!'"
                            :visible="popupVisible"
                            @close="popupVisible = false"
                        /> -->
                        
                        <h2>Description</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum voluptatem a cum porro veritatis facilis explicabo repellat? <br>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic eos explicabo debitis eius eveniet vitae fugiat quaerat nesciunt nihil, alias cupiditate quod suscipit odio, corrupti animi ea fugit minus officiis perferendis! Ullam, dolorem magni alias aspernatur ipsum nulla quia accusantium omnis dicta dignissimos culpa repellat laudantium, dolores quod. Pariatur expedita doloribus nostrum eius neque deserunt vitae vero eveniet corrupti, autem hic repellat temporibus delectus illo minus repellendus aperiam omnis. Voluptatibus, nesciunt! Nesciunt unde omnis voluptate quos aut id veniam autem temporibus a iusto ipsam odit suscipit in obcaecati ratione consequatur libero magni delectus, quaerat aliquid animi tenetur facilis officia. Tempora.</p>
                        <div class="action">
                            <a href="#save"><img src="../../../../public/icons/livres.png" alt="">Lire</a>
                            <a href="#save"><img src="../../../../public/icons/save.png" alt="">Enregistrer</a>
                            <a href="#download"><img src="../../../../public/icons/download.png" alt="">Télécharger</a>
                            <a href="#download"><img src="../../../../public/icons/partager.png" alt="">Partager</a>
                        </div>
                        <form v-if="isAuthenticated"action="">
                            <img id="profil"src="../../../../public/cover 2.jpg" alt="">
                            <textarea name="" id="" placeholder="Donnez votre avis..."></textarea>
                            <button><img src="../../../../public/icons/send.png" alt=""></button>
                        </form>
                        <div class="avis">
                            <div class="profile">
                                <img src="../../../../public/cover 4.jfif" alt="">
                                <div class="coms">
                                    <b><a href="">Nom</a></b>
                                    <p><span> Le <b>15/02/2024</b></span>,<br>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                                    <span class="answer">2mois <b>Répondre</b> <b><img src="../../../../public/icons/like.png" alt="">2</b></span>
                                </div>
                            </div>
                            <div class="profile">
                                <img src="../../../../public/cover 4.jfif" alt="">
                                <div class="coms">
                                    <b><a href="">Nom</a></b>
                                    <p><span> Le <b>15/02/2024</b></span>,<br>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                                </div>
                            </div>
                            <div class="profile">
                                <img src="../../../../public/cover 4.jfif" alt="">
                                <div class="coms">
                                    <b><a href="">Nom</a></b>
                                    <p><span> Le <b>15/02/2024</b></span>,<br>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                                </div>
                            </div>
                            <div class="profile">
                                <img src="../../../../public/cover 4.jfif" alt="">
                                <div class="coms">
                                    <b><a href="">Nom</a></b>
                                    <p><span> Le <b>15/02/2024</b></span>,<br>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde doloribus ea optio aliquid sequi ducimus molestiae neque quos adipisci!</p>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>

        <section class="popular-books">
            <h2>Les Livres Similaires</h2>

            <div class="row">
                <div class="books" v-for="(book, index) in books" :key="index">
                    <a href="/books/detail">
                        <div class="img">
                            <img :src="book.cover" alt="">
                        </div>
                        <div class="info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="poste">
                            Publié par <b>{{ book.postedBy }}</b>,<br>
                            Le <b>{{ book.date }}</b>,<br>
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
                                <span><img src="../../../../public/icons/oeil.png" alt="">1,3k</span>
                                <span><img src="../../../../public/icons/coms.png" alt="">150</span>
                                <span><img src="../../../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                        <div class="desc">
                            <p id="type">{{ book.type }}</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque voluptates aspernatur consequatur non blanditiis qui unde minima natus eveniet in? ...</p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../../public/icons/save.png" alt="">Enregistrer</a>
                                <a href="#download" class="actionButton"><img src="../../../../public/icons/download.png" alt="">Télécharger</a>
                            </div>
                        </div>
                    </a>
                </div>
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
    height: 30px;
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
    display: flex;
    align-items: center;
    color: #AAAAAA;
    font-family: 'Poppins';
}
.one .desc .avis .profile .coms .answer b{
    margin-left: 10px;
    margin-right: 10px;
}
.one .desc .avis .profile .coms .answer img{
    height: 20px;
    border: none;
    border-radius: 0;
    padding: 0;
    object-fit: none;
    width: auto;
}
.rating {
  display: flex;
  cursor: pointer;
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