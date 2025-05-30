<script setup>
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';
import { useUser } from '@/composables/useUser';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks';

const { user, isLoggedIn, isUserLoading } = useUser();
const { books, isLoading, hasMore, error, loadMoreUserBook } = useLoadMoreBooks(4);

const getImageUrl = (imgPath) => {
  return `http://localhost:8000/${imgPath}`;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  loadMoreUserBook();
});

</script>

<template>
    <div class="content-page">
        <section class="popular-books">
            <h2>Publiés</h2>

            <div v-if="books.length == 0" class="noResult">
                <p>Merci de patienter un moment... ou commencez à partager un livre</p>
            </div>
            <div v-else class="">
                <div class="card">
                    <a :href="`/books/${book.id}`" class="book" v-for="(book, index) in books.slice(0, 4)" :key="index">
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
                            <img :src="getImageUrl(book.picture)" :alt="book.title" />
                            <p id="type">Fiction</p>
                            <div class="book-info">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                                <p id="postedBy">
                                Publié par <b>{{ user.name }}</b>,<br>
                                Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                                Lang : <b>FR</b>
                                </p>
                                <div class="flex justify-between items-center text-sm mt-3 text-gray-500">
                                    <div class="flex items-center gap-1 text-[#E67E22]">
                                        <Icon icon="flowbite:star-solid" v-for="i in 4" :key="i" />
                                        <Icon icon="flowbite:star-outline" />
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="flex items-center">
                                        <Icon icon="entypo:eye" class="mr-1" /> 1,3k
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="iconamoon:comment-fill" class="mr-1" /> 112
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="ic:round-download" class="mr-1" /> 900
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </a>
                </div>
                <router-link to="/books/posted" id="seeMore">Voir plus</router-link>
            </div>

        </section>
        
        <section class="popular-books">
            <h2>Enregistrés</h2>

            <div class="noResult" v-if="books.length == 0">
                <p>Merci de patienter un moment... ou commencez à enregistrer un livre</p>
            </div>
            <div v-else class="">
                <div href="" class="card">
                    <a href="/books/detail" class="book" v-for="(book, index) in books" :key="index">
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
                            <img :src="getImageUrl(book.picture)" :alt="book.title">
                            <p id="type">Fiction</p>
                            <div class="book-info">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                                <p id="postedBy">
                                Publié par <b>{{ book.postedBy }}</b>,<br>
                                Le <b>{{ book.date }}</b>,<br>
                                Lang : <b>FR</b>
                                </p>
                                <div class="flex justify-between items-center text-sm mt-3 text-gray-500">
                                    <div class="flex items-center gap-1 text-[#E67E22]">
                                        <Icon icon="flowbite:star-solid" v-for="i in 4" :key="i" />
                                        <Icon icon="flowbite:star-outline" />
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="flex items-center">
                                        <Icon icon="entypo:eye" class="mr-1" /> 1,3k
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="iconamoon:comment-fill" class="mr-1" /> 112
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="ic:round-download" class="mr-1" /> 900
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </a>
                </div>

                <router-link to="/books/popular" id="seeMore">Voir plus</router-link>
            </div>

        </section>

        <section class="popular-books">
            <h2>Téléchargés</h2>

            <div class="noResult" v-if="books.length == 0">
                <p>Merci de patienter un moment... ou commencez à télécharger un livre</p>
            </div>
            <div class="" v-else>
                <div class="card">
                    <a href="/books/detail" class="book"  v-for="(book, index) in books" :key="index">
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
                            <img :src="getImageUrl(book.picture)" :alt="book.title">
                            <p id="type">Fiction</p>
                            <div class="book-info">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                                <p id="postedBy">
                                Publié par <b>{{ book.posted_by.name }}</b>,<br>
                                Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                                Lang : <b>FR</b>
                                </p>
                                <div class="flex justify-between items-center text-sm mt-3 text-gray-500">
                                    <div class="flex items-center gap-1 text-[#E67E22]">
                                        <Icon icon="flowbite:star-solid" v-for="i in 4" :key="i" />
                                        <Icon icon="flowbite:star-outline" />
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="flex items-center">
                                        <Icon icon="entypo:eye" class="mr-1" /> 1,3k
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="iconamoon:comment-fill" class="mr-1" /> 112
                                        </span>
                                        <span class="flex items-center">
                                        <Icon icon="ic:round-download" class="mr-1" /> 900
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </a>
                </div>

                <a href="" id="seeMore">Voir plus</a>
            </div>

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
.noResult p{
    display: flex;
    justify-content: center;
    color: white;
    font-family: 'Poppins';
    font-size: 12px;
}
</style>