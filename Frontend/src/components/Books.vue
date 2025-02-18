<script>
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

            <div v-if="books.length > 0" href="" class="card">
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
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../public/icons/coms.png" alt=""> 112</span>
                            <span><img src="../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div v-else class="">
                <p>Pas de livre disponible pour le moment</p>
            </div>
            <router-link v-if="books.length > 0" to="/books/popular" id="seeMore">Voir plus</router-link>

        </section>

        <section class="popular-books">
            <h2>Les derniers ajouts</h2>

            <div v-if="books.length > 0" class="card">
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
                        <img v-if="book.picture" :src="getImageUrl(book.picture)" :alt="book.title">
                        <p id="type">Fiction</p>
                        <div class="book-info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="postedBy">
                            Publié par <b>{{ book.posted_by }}</b>,<br>
                            Le <b>{{ book.created_at }}</b>,<br>
                            Lang : <b>{{ book.lang }}</b>
                            </p>
                            <div class="content-book">
                            <div class="note">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note-active.png" alt="">
                                <img src="../../public/icons/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../public/icons/coms.png" alt=""> 112</span>
                            <span><img src="../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div v-else class="">
                <p>Pas de livre disponible pour le moment</p>
            </div>

            <a v-if="books.length > 0" href="" id="seeMore">Voir plus</a>

        </section>
    </div>
</template>

<style>
.content-page{
    padding: 80px;
    color: white;
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