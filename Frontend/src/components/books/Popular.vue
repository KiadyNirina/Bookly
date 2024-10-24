<script>
export default {
    data() {
      return {
        books: [
          { title: 'Titre du Livre 1', author: 'Christophe RABEARIMANANA', potedBy: 'John Doe', date: '19/10/2024', cover: '../../public/cover 1.jpg', isPopular: true },
          { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', potedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 2.jpg', isRecommended: true },
          { title: 'Titre du Livre 1', author: 'Auteur 1', potedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 3.jpg', isPopular: true },
          { title: 'Titre du Livre 2', author: 'Auteur 2', potedBy: 'John Doe', date: '16/10/2024', cover: '../../public/cover 4.jfif', isRecommended: true },
          // ... autres livres
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

            <div href="" class="row">
                <a href="" class="books" v-for="(book, index) in books" :key="index">
                    <div class="img">
                        <img :src="book.cover" alt="">
                    </div>
                    <div class="info">
                        <h3>{{ book.title }}</h3>
                        <p>{{ book.author }}</p>
                        <p id="poste">
                        Publié par <b>{{ book.potedBy }}</b>,<br>
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
                            <span><img src="../../../public/download.png" alt=""> 900</span>
                        </div>
                    </div>
                    <div class="desc">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque voluptates aspernatur consequatur non blanditiis qui unde minima natus eveniet in?</p>
                    </div>
                </a>
            </div>

            <a href="" id="seeMore">Voir plus</a>

        </section>
    </div>
</template>

<style>
.row .books{
    display: flex;
    width: 100%;
    text-align: left;
    margin: 10px;
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
.row .books:hover{
  box-shadow: 0px 0px 10px #3355ffc2;
}
.row .books .info {
    padding: 10px;
    width: 30%;
}
.row .info h3{
  font-size: 25px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-transform: uppercase;
  color: #4388ff;
  margin: 0;
}

.row .info p{
  color: rgba(255, 255, 255, 0.352);
  margin: 0;
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.row .content-book span{
  font-size: 15px;
  display: flex;
  align-items: center;
  margin: auto;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#poste{
    font-size: 15px;
    margin: 10px 0px 10px 0px;
}
.row .books .content-book span img{
  height: 10px;
  width: auto;
}
.row .books .desc{
    width: 40%;
    padding: 5px;
    color: rgba(255, 255, 255, 0.434);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>