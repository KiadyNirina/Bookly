<script setup>
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'

const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(4) 

loadMore()

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
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

    <!-- SECTION POPULAIRES -->
    <section class="popular-books">
      <h2>Les Plus Populaires</h2>
      <div v-if="books.length > 0" class="card">
        <a v-for="(book, index) in books" :key="index" href="/books/detail" class="book">
          <div class="badge">
            <div class="popular">Populaire</div>
          </div>
          <img :src="getImageUrl(book.picture)" :alt="book.title" />
          <p id="type">Fiction</p>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <p id="postedBy">
              Publié par <b>{{ book.posted_by.name }}</b>,<br />
              Le <b>{{ book.created_at }}</b>,<br />
              Lang : <b>{{ book.lang }}</b>
            </p>
            <div class="content-book">
              <div class="note">
                <img src="../../public/icons/note-active.png" alt="" v-for="i in 4" :key="i" />
                <img src="../../public/icons/note.png" alt="" />
              </div>
              <span>👀1,3k</span>
              <span><img src="../../public/icons/coms.png" alt="" /> 112</span>
              <span><img src="../../public/icons/download.png" alt="" /> 900</span>
            </div>
          </div>
        </a>
      </div>
      <div v-else>
        <p>Pas de livre disponible pour le moment</p>
      </div>
      <router-link v-if="books.length > 0" to="/books/popular" id="seeMore">Voir plus</router-link>
    </section>

    <!-- SECTION DERNIERS AJOUTS -->
    <section class="popular-books">
      <h2>Les derniers ajouts</h2>
      <div v-if="books.length > 0" class="card">
        <a v-for="book in books" :key="book.id" :href="`/books/${book.id}`" class="book">
          <img :src="getImageUrl(book.picture)" :alt="book.title" />
          <p id="type">Fiction</p>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <p id="postedBy">
              Publié par <b>{{ book.posted_by.name }}</b>,<br />
              Le <b>{{ book.created_at }}</b>,<br />
              Lang : <b>{{ book.lang }}</b>
            </p>
            <div class="content-book">
              <div class="note">
                <img src="../../public/icons/note-active.png" alt="" v-for="i in 4" :key="i" />
                <img src="../../public/icons/note.png" alt="" />
              </div>
              <span>👀1,3k</span>
              <span><img src="../../public/icons/coms.png" alt="" /> 112</span>
              <span><img src="../../public/icons/download.png" alt="" /> 900</span>
            </div>
          </div>
        </a>
      </div>
      <div v-else>
        <p>Pas de livre disponible pour le moment</p>
      </div>
      <a v-if="books.length > 0" href="/books/recent" id="seeMore">Voir plus</a>
    </section>
  </div>
</template>

<style>
.content-page{
    padding: 80px;
    color: white;
    font-family: 'poppins';
}
.content-page .tri{
    display: flex;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
}
.content-page .tri a{
    text-decoration: none;
    color: white;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.397);
    border-radius: 20px;
    transition: 0.5s;
}
.content-page .tri a:hover{
    background-color: rgba(255, 255, 255, 0.235);
}
</style>