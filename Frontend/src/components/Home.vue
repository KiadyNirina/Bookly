<script>
import { Icon } from '@iconify/vue';
export default {
  components: {
    Icon
  },
  data() {
    return {
      books: [
        { title: 'Titre du Livre 1', author: 'Christophe RABEARIMANANA', potedBy: 'John Doe', cover: '../../public/cover 1.jpg', isPopular: true, link: 1 },
        { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', potedBy: 'John Doe', cover: '../../public/cover 2.jpg', isRecommended: true, link: 2 },
        { title: 'Titre du Livre 1', author: 'Auteur 1', potedBy: 'John Doe', cover: '../../public/cover 3.jpg', isPopular: true, link: 3 },
        { title: 'Titre du Livre 2', author: 'Auteur 2', potedBy: 'John Doe', cover: '../../public/cover 4.jfif', isRecommended: true, link: 4 },
      ]
    };
  }
}
</script>


<template>
  <div class="content max-w-[1400px] mr-auto ml-auto">
    <div class="content-1 w-1/2">
      <h1>Découvrez un univers de lecture illimité</h1>
      <p>Des milliers de livres à portée de main, où que vous soyez</p>
      <a href="">
        Explorer les nouveautés
      </a>
    </div>
    <div class="w-1/2">
      <img src="../../public/reading.svg" alt="">
    </div>
  </div>

  <section class="popular-books">
    <h2>Populaires</h2>

    <div class="card">
      <div class="book" v-for="(book, index) in books" :key="index">
        <a href="/books/detail">
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
          <img :src="book.cover" :alt="book.title">
          <p id="type">Fiction</p>
          <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p>{{ book.author }}</p>
              <p id="postedBy">
                Publié par <b>{{ book.potedBy }}</b><br>
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

    <a href="/books/popular" id="seeMore">Voir plus</a>

  </section>

</template>

<style>
@font-face {
  font-family: 'Poppins-bold';
  src: url('../../../../public/font/Poppins/Poppins-Bold.ttf');
}
body{
  background-color: #010310;
}
.content{
  padding: 50px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "poppins";
}
.content .content-1 h1{
  color: #FAFAFA;
  font-family: "poppins-bold";
  font-size: 50px;
}
.content .content-1 p{
  color: #FAFAFA;
  margin-bottom: 50px;
}
.content .content-1 a{
  text-decoration: none;
  color: white;
  background-color: #E67E22;
  padding: 15px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  transition: 0.5s;
  border: 2px solid #E67E22;
}
.content .content-1 a:hover{
  color: #E67E22;
  background-color: transparent;
}

.popular-books {
  background-color: #010310;
  padding-top: 50px;
  /* height: 510px; */
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
}

.popular-books h2 {
  font-family: 'poppins';
  font-size: 1.5rem;
  color: white; 
  margin-bottom: 20px;
}

.badge {
  position: absolute;
}

.badge .popular, .badge .recommended {
  background-color: #E67E22;
  color: white;
  padding: 10px;
  font-family: 'poppins';
  border-radius: 100%;
  font-size: 12px;
}

.badge .popular{
  background-color: #E67E22;
}

.badge .recommended {
  background-color: #2ECC71;
}

.card {
  display: flex;
  width: 100%;
  padding: 0;
}

.card .book{
  width: 25%;
  margin: 5px;
  padding: 0;
  border: 1px solid #4388ff27;
  border-radius: 20px;
  text-decoration: none;
  transition: 0.2s;
}

.card .book:hover{
  box-shadow: 0px 0px 10px #3355ffc2;
}

.card .book a{
  text-decoration: none;
}

.card .book img{
  height: 200px;
  object-fit: cover;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
}

#type{
  text-decoration: none;
  background-color: #4388ff67;
  color: #FAFAFA;
  text-transform: uppercase;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: bold;
  font-style: italic;
  padding-left: 20px;
}

.book-info {
  padding : 20px;
  font-family: 'poppins';
}

.book-info h3{
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-transform: uppercase;
  color: #4388ff;
  margin: 0;
}

.book-info p{
  color: rgba(255, 255, 255, 0.352);
  margin: 0;
  font-size: 15px;
}

#postedBy{
  font-size: 12px;
  margin: 10px 0px 10px 0px;
}

.content-book {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.587);
  margin-bottom: 10px;
}

.content-book .note{
  padding: 5px;
  width: auto;
  display: flex;
  align-items: center;
}

.content-book .note img{
  height: 15px;
  width: auto;
  object-fit: cover;
}

.content-book span{
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: auto;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.card .book .content-book span img{
  height: 12px;
  width: auto;
  margin-right: 2px;
}

#seeMore{
  text-decoration: none;
  color: white;
  background-color: #E67E22;
  border: 2px solid #E67E22;
  padding: 15px;
  border-radius: 30px;
  transition: 0.5s;
  font-size: 12px;
  font-family: 'poppins';
}
#seeMore:hover{
  background-color: transparent;
  color: #E67E22;
}

</style>