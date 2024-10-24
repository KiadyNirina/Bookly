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

            <div href="" class="card">
            <a href="" class="book" v-for="(book, index) in books" :key="index">
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
                    <span><img src="../../public/download.png" alt=""> 900</span>
                    </div>
                </div>
            </a>
            </div>

            <a href="" id="seeMore">Voir plus</a>

        </section>
    </div>
</template>