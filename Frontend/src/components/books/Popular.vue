<script>
export default {
    data() {
      return {
        books: [
          { title: 'A tout les garçon que j\'ai aimé', author: 'Christophe RABEARIMANANA', postedBy: 'John Doe', date: '19/05/2023', cover: '../../public/cover 1.jpg', isPopular: true, type: 'Romance' },
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

        <section class="popular-books">
            <h2>Les Plus Populaires</h2>

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
                                    <img src="../../../public/note-active.png" alt="">
                                    <img src="../../../public/note-active.png" alt="">
                                    <img src="../../../public/note-active.png" alt="">
                                    <img src="../../../public/note-active.png" alt="">
                                    <img src="../../../public/note.png" alt="">
                                </div>
                                <span>👀1,3k</span>
                                <span><img src="../../../public/coms.png" alt="">150</span>
                                <span><img src="../../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                        <div class="desc">
                            <p id="type">{{ book.type }}</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque voluptates aspernatur consequatur non blanditiis qui unde minima natus eveniet in? ...</p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../public/save.png" alt="">Enregistrer</a>
                                <a href="#download" class="actionButton"><img src="../../../public/download.png" alt="">Télécharger</a>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

        </section>
    </div>
</template>

<style>
.row .books a{
    display: flex;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    transition: 0.2s;
    border: 1px solid #4388ff27;
    border-radius: 20px;
    text-decoration: none;
}
.row .books .img{
    height: 200px;
    width: 30%;
    border-radius: 0px;
}
.row .books .img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px 0px 0px 20px;
}
.row .books a:hover{
  box-shadow: 0px 0px 10px #3355ffc2;
}
.row .books .info {
    padding: 10px;
    width: 30%;
}
.row .info h3{
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-transform: uppercase;
  color: #4388ff;
  margin: 0;
}

.row .info p{
  color: rgba(255, 255, 255, 0.52);
  margin: 0;
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.row .content-book {
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
}
.row .content-book span{
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: auto;
  font-family: 'Courier New', Courier, monospace;
  color: rgba(255, 255, 255, 0.722);
}
#poste{
    font-size: 15px;
    margin: 10px 0px 10px 0px;
}
.row .books .content-book span img{
  height: 13px;
  width: auto;
  margin-right: 2px;
}
.row .books .desc{
    width: 40%;
    padding: 5px;
    color: rgba(255, 255, 255, 0.434);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.row .books .desc #type{
    text-align: center;
    background-color: #4388ff28;
}
.row .books .desc .action{
    display: flex;
}
.row .books .desc .action .actionButton{
    padding: 10px;
    border-radius: 10px;
    display: flex;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.842);
    font-weight: bold;
    font-size: 15px;
    align-items: center;
    border: none;
    justify-content: center;
}
.row .books .desc .action .actionButton:hover{
    background-color: rgba(128, 128, 128, 0.197);
    box-shadow: none;
}
.row .books .desc .action .actionButton img{
    height: 20px;
    margin-right: 5px;
}
</style>