<script>
export default {
    data() {
      return {
        books: [
          { title: 'A travers la fenêtre', author: 'Christophe RABEARIMANANA', postedBy: 'John Doe', date: '19/05/2023', cover: '../../public/cover 1.jpg', isPopular: true, type: 'Romance' },
          { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', postedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 2.jpg', isRecommended: true, type: 'Fiction' },
          { title: 'Titre du Livre 1', author: 'Auteur 1', postedBy: 'John Doe', date: '22/06/2024', cover: '../../public/cover 3.jpg', isPopular: true, type: 'Fantaisie' },
          { title: 'Titre du Livre 2', author: 'Auteur 2', postedBy: 'John Doe', date: '16/10/2024', cover: '../../public/cover 4.jfif', isRecommended: true , type: 'Fiction'},
        ]
      };
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
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note.png" alt="">
                                </div>
                                <span>👀1,3k</span>
                                <span><img src="../../../../public/coms.png" alt="">150</span>
                                <span><img src="../../../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </div>

                    <div class="desc">
                        <h2>Description</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum voluptatem a cum porro veritatis facilis explicabo repellat? <br>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic eos explicabo debitis eius eveniet vitae fugiat quaerat nesciunt nihil, alias cupiditate quod suscipit odio, corrupti animi ea fugit minus officiis perferendis! Ullam, dolorem magni alias aspernatur ipsum nulla quia accusantium omnis dicta dignissimos culpa repellat laudantium, dolores quod. Pariatur expedita doloribus nostrum eius neque deserunt vitae vero eveniet corrupti, autem hic repellat temporibus delectus illo minus repellendus aperiam omnis. Voluptatibus, nesciunt! Nesciunt unde omnis voluptate quos aut id veniam autem temporibus a iusto ipsam odit suscipit in obcaecati ratione consequatur libero magni delectus, quaerat aliquid animi tenetur facilis officia. Tempora.</p>
                        <div class="action">
                            <a href="#save"><img src="../../../../public/save.png" alt="">Enregistrer</a>
                            <a href="#download"><img src="../../../../public/download.png" alt="">Télécharger</a>
                        </div>
                        <form action="">
                            <textarea name="" id="" placeholder="Donnez votre avis..."></textarea>
                            <button><img src="../../../../public/send.png" alt=""></button>
                        </form>
                        <div class="avis">
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
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note-active.png" alt="">
                                    <img src="../../../../public/note.png" alt="">
                                </div>
                                <span>👀1,3k</span>
                                <span><img src="../../../../public/coms.png" alt="">150</span>
                                <span><img src="../../../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                        <div class="desc">
                            <p id="type">{{ book.type }}</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque voluptates aspernatur consequatur non blanditiis qui unde minima natus eveniet in? ...</p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../../public/save.png" alt="">Enregistrer</a>
                                <a href="#download" class="actionButton"><img src="../../../../public/download.png" alt="">Télécharger</a>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

        </section>
    </div>
</template>

<style>
.one{
    padding: 10px;
    border: 1px solid #4388ff27;
    border-radius: 20px;
    display: flex;
    margin-top: 10px;
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
.one .sect1 .info h3{
    font-size: 30px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    text-transform: uppercase;
    color: #4388ff;
    margin-bottom: 0;
}
.one .sect1 .info p{
    color: rgba(255, 255, 255, 0.545);
    margin: 0;
    font-size: 15px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
    padding: 10px;
}
.one .desc h2{
    margin: 0;
}
.one .desc p{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: rgba(255, 255, 255, 0.57);
    height: 230px;
    overflow-y: auto;
}
.one .desc .action{
    display: flex;
}
.one .desc .action a{
    padding: 10px;
    border-radius: 10px;
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
.one .desc form textarea{
    width: 100%;
    background-color: transparent;
    border-radius: 15px;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.227);
    font-family: 'Courier New', Courier, monospace;
    padding: 10px;
}
.one .desc form button{
    background-color: transparent;
    border: none;
    border-radius: 15px;
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
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 100%;
    border: 1px solid rgba(255, 255, 255, 0.334);
    padding: 2px;
}
.one .desc .avis .profile .coms{
    background-color: rgba(255, 255, 255, 0.081);
    margin-left: 5px;
    padding: 10px;
    border-radius: 15px;
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
}

</style>