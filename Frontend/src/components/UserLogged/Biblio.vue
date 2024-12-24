<script>
export default {
    // ...existing code...
    mounted() {
        this.fetchBooks();
        this.fetchUserBooks();
    },
    // ...existing code...
}
</script>

<template>
    <div class="content-page">
        <section class="popular-books">
            <div class="users">
                <a href="/user"class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe <img src="../../../public/icons/badge.png" alt=""></h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
                <a href="/user" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe <img src="../../../public/icons/badge.png" alt=""></h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
                <a href="/user"class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe <img src="../../../public/icons/badge.png" alt=""></h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
                <a href="/user" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe</h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
                <a href="/user" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe</h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
                <a href="/user" class="user">
                    <img src="../../../public/cover 1.jpg" alt="">
                    <div class="">
                        <h1>Cristophe <img src="../../../public/icons/badge.png" alt=""></h1>
                        <span><b>255</b> abonnés</span>
                    </div>
                </a>
            </div>
            <router-link to="/books/popular" id="seeMore">Voir plus</router-link>
        </section>

        <section class="popular-books">
            <h2>Publiés</h2>

            <div v-if="userBooks.length != 0" class="">
                <div class="card">
                    <div class="book" v-for="(book, index) in userBooks.slice(0, 4)" :key="index">
                        <a :href="`/books/${book.id}`">
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
                            <img :src="book.picture ? getImageUrl(book.picture) : getImageUrl(defaultImg)" :alt="book.title" />
                            <p id="type">Fiction</p>
                            <div class="book-info">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                                <p id="postedBy">
                                Publié par <b>{{ user.name }}</b>,<br>
                                Le <b>{{ book.created_at }}</b>,<br>
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
                                <span><img src="../../../public/icons/coms.png" alt=""> 112</span>
                                <span><img src="../../../public/icons/download.png" alt=""> 900</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <router-link to="/books/posted" id="seeMore">Voir plus</router-link>
            </div>
            <div v-else class="">
                <p>Chargement...</p>
            </div>

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
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../../public/coms.png" alt=""> 112</span>
                            <span><img src="../../../public/download.png" alt=""> 900</span>
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
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note-active.png" alt="">
                                <img src="../../../public/icons/note.png" alt="">
                            </div>
                            <span>👀1,3k</span>
                            <span><img src="../../../public/coms.png" alt=""> 112</span>
                            <span><img src="../../../public/download.png" alt=""> 900</span>
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
    height: 50px;
    width: 50px;
    border-radius: 100%;
    object-fit: cover;
}
.content-page .users .user h1{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 15px;
    display: flex;
    align-items: center;
    margin: 0px 5px 0px 5px;
}
.content-page .users .user h1 img{
    height: 15px;
    width: 15px;
    margin-left: 2px;
}
.content-page .users .user span{
    font-size: 12px;
    margin: 0;
    color: rgba(255, 255, 255, 0.587);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>