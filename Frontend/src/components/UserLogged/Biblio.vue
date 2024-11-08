<script>
export default {
    data() {
      return {
        books: [
          { title: 'Titre du Livre 1', author: 'Christophe RABEARIMANANA', potedBy: 'John Doe', date: '19/10/2024', cover: '../../public/cover 1.jpg', isPopular: true },
          { title: 'Titre du Livre 2', author: 'Nanja RAZAFINDRAKOTO', potedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 2.jpg', isRecommended: true },
          { title: 'Titre du Livre 1', author: 'Auteur 1', potedBy: 'John Doe', date: '17/10/2024', cover: '../../public/cover 3.jpg', isPopular: true },
          { title: 'Titre du Livre 2', author: 'Auteur 2', potedBy: 'John Doe', date: '16/10/2024', cover: '../../public/cover 4.jfif', isRecommended: true },
        ]
      };
    }
}
</script>

<template>
    <div class="content-page">
        <section class="popular-books">
            <div class="users">
                <a href=""class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
                <a href="" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
                <a href=""class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
                <a href="" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
                <a href=""class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
                <a href="" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <h1>Nom</h1>
                </a>
            </div>
            <router-link to="/books/popular" id="seeMore">Voir plus</router-link>
        </section>

        <section class="popular-books">
            <h2>Publiés</h2>

            <div href="" class="card">
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
                            Publié par <b>{{ book.potedBy }}</b>,<br>
                            Le <b>{{ book.date }}</b>,<br>
                            Lang : <b>FR</b>
                            </p>
                            <div class="content-book">
                            <div class="note">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../public/coms.png" alt=""> 112</span>
                            <span><img src="../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <router-link to="/books/popular" id="seeMore">Voir plus</router-link>

        </section>
        
        <section class="popular-books">
            <h2>Enregistrés</h2>

            <div href="" class="card">
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
                            Publié par <b>{{ book.potedBy }}</b>,<br>
                            Le <b>{{ book.date }}</b>,<br>
                            Lang : <b>FR</b>
                            </p>
                            <div class="content-book">
                            <div class="note">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../public/coms.png" alt=""> 112</span>
                            <span><img src="../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <router-link to="/books/popular" id="seeMore">Voir plus</router-link>

        </section>

        <section class="popular-books">
            <h2>Téléchargés</h2>

            <div class="card">
                <div class="book"  v-for="(book, index) in books" :key="index">
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
                            Publié par <b>{{ book.potedBy }}</b>,<br>
                            Le <b>{{ book.date }}</b>,<br>
                            Lang : <b>FR</b>
                            </p>
                            <div class="content-book">
                            <div class="note">
                                <img src="../../../public/note-active.png" alt="">
                                <img src="../../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note-active.png" alt="">
                                <img src="../../public/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../public/coms.png" alt=""> 112</span>
                            <span><img src="../../public/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <a href="" id="seeMore">Voir plus</a>

        </section>
    </div>
</template>

<style>
.content-page .users{
    display: flex;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid rgba(255, 255, 255, 0.087);
    border-radius: 15px;
    padding: 15px;
}
.content-page .users .user{
    display: flex;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    text-decoration: none;
    color: white;
    transition: 0.2s;
}
.content-page .users .user:hover {
    background-color: rgba(128, 128, 128, 0.202);
    border-radius: 15px;
}
.content-page .users .user img{
    height: 60px;
    width: 60px;
    border-radius: 100%;
    object-fit: cover;
}
.content-page .users .user h1{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
    margin-left: 5px;
}
</style>