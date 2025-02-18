<script>
export default {
    data() {
      return {
        bookes: [
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
                <div class="books" v-for="(book, index) in bookes" :key="index">
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
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note.png" alt="">
                                </div>
                                <span>👀1,3k</span>
                                <span><img src="../../../public/icons/coms.png" alt="">150</span>
                                <span><img src="../../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                        <div class="desc">
                            <p id="type">{{ book.type }}</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque voluptates aspernatur consequatur non blanditiis qui unde minima natus eveniet in? ...</p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../public/icons/save.png" alt="">Enregistrer</a>
                                <a href="#download" class="actionButton"><img src="../../../public/icons/download.png" alt="">Télécharger</a>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

        </section>
    </div>
</template>

<style>
</style>