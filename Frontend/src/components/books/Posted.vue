<script setup>
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser';

const { user, isLoggedIn, isUserLoading } = useUser();
const {
  books,
  isLoading,
  hasMore,
  error,
  loadMoreUserBook
} = useLoadMoreBooks(5) // 5 livres à la fois

// Charger les premiers livres au montage
loadMoreUserBook()

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
            <h2>Les livres que vous avez publiés</h2>

            <div v-if="books.length != 0" class="row">
                <div class="books" v-for="(book, index) in books" :key="index">
                    <a :href="`/books/${book.id}`">
                        <div class="img">
                            <img :src="book.picture ? getImageUrl(book.picture) : getImageUrl(defaultImg)" :alt="book.title" />
                        </div>
                        <div class="info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="poste">
                            Publié par <b>{{ user.name }}</b>,<br>
                            Le <b>{{ formatDate(book.created_at) }}</b>,<br>
                            Langue : <b>{{ book.lang }}</b>
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
                            <p v-html="truncateText((book.description.replace(/\n/g, '<br>')), 200)"></p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../public/icons/save.png" alt=""></a>
                                <a href="#save" class="actionButton"><img src="../../../public/icons/modifier.png" alt=""></a>
                                <a href="#download" class="actionButton"><img src="../../../public/icons/supprimer.png" alt=""></a>
                                <a href="#download" class="actionButton"><img src="../../../public/icons/partager.png" alt=""></a>
                            </div>
                        </div>
                    </a>
                </div>

                <button v-if="hasMore" @click="loadMoreUserBook" id="seeMore">Voir Plus</button>
            </div>
            <div v-else>
                <p style="font-size: 12px;">Chargement...</p>
            </div>

        </section>
    </div>
</template>

<style>
</style>