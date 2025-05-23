<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser';

const { user } = useUser();
const {
  books,
  isLoading,
  hasMore,
  error,
  loadMore
} = useLoadMoreBooks(5) // 5 livres à la fois

loadMore()

function getImageUrl(imgPath) {
  return `http://localhost:8000/${imgPath}`;
}

function truncateText(text, maxlength) {
    if(text.length > maxlength) {
        return text.slice(0, maxlength) + '...';
    }
    return text;
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
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
            <h2>Les livres les plus récents</h2>

            <div v-if="books.length != 0" class="row">
                <div class="books" v-for="(book, index) in books" :key="index">
                    <a :href="`/books/${book.id}`">
                        <div class="img">
                            <img :src="getImageUrl(book.picture)" :alt="book.title" />
                        </div>
                        <div class="info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="poste">
                            Publié par <b>{{ book.posted_by.name }}</b>,<br>
                            Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                            Lang : <b>{{ book.lang }}</b>
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
                        <div class="desc">
                            <p id="type">{{ book.genre }}</p>
                            <p v-html="truncateText((book.description.replace(/\n/g, '<br>')), 200)"></p>
                            <div class="action">
                                <a href="#save" class="actionButton">
                                    <Icon icon="stash:save-ribbon" />
                                </a>
                                <a v-if="user && book.posted_by.name === user.name" href="#save" class="actionButton">
                                    <Icon icon="material-symbols:edit" />
                                </a>
                                <a v-if="user && book.posted_by.name === user.name" href="#delete" class="actionButton">
                                   <Icon icon="ic:round-delete" />
                                </a>
                                <a href="#download" class="actionButton">
                                    <Icon icon="mage:share-fill" class="mr-1" />
                                </a>
                            </div>
                        </div>
                    </a>
                </div>

                <button
                v-if="hasMore && books.length > 0"
                @click="loadMore"
                :disabled="isLoading"
                id="seeMore"
                >
                    {{ isLoading ? 'Chargement...' : 'Voir plus' }}
                </button>
            </div>
            <div v-else class="">
                <p style="font-size: 12px;">Chargement...</p>
            </div>

        </section>
    </div>
</template>

<style>
.row{
    font-family: 'poppins';
}
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
    font-size: 12px;
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
}
.row .books .desc #type{
    text-align: center;
    background-color: #4388ff28;
}
.row .books .desc p {
    font-size: 13px;
}
.row .books .desc .action{
    display: flex;
    justify-content: right;
    padding-right: 10px;
}
.row .books .desc .action .actionButton{
    padding: 5px;
    border-radius: 10px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.842);
    font-weight: bold;
    width: auto;
    border: none;
}
.row .books .desc .action .actionButton:hover{
    background-color: rgba(128, 128, 128, 0.197);
    box-shadow: none;
}
.row .books .desc .action .actionButton img{
    height: 20px;
    margin: 0;
}
</style>