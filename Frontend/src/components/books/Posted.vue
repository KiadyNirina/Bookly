<script setup>
import { Icon } from '@iconify/vue';
import { useLoadMoreBooks } from '@/composables/useLoadMoreBooks'
import { useUser } from '@/composables/useUser';

const { user, isLoggedIn, isUserLoading } = useUser();
const {
  books,
  isLoading,
  hasMore,
  error,
  loadMoreUserBook
} = useLoadMoreBooks(8) // 8 livres à la fois

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

            <div  v-if="books.length != 0" class="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
                <a :href="`/books/${book.id}`" class="book border-1 border-[#4388ff27] rounded-2xl transition duration-200 hover:shadow-[0_0_10px_#3355ffc2]" v-for="book in books" :key="book.id">
                <img style="height: 200px; width: 100%; object-fit: cover;" class="rounded-t-2xl" :src="getImageUrl(book.picture)" :alt="book.title">
                <p id="type">{{ book.genre }}</p>
                <div class="book-info">
                    <h3>{{ book.title }}</h3>
                    <p>{{ book.author }}</p>
                    <p id="postedBy">
                    Publié par <b>{{ user.name }}</b>,<br>
                    Le <b>{{ formatDate(book.created_at) }}</b>,<br>
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
            <div v-else class="">
                <p style="font-size: 12px;">Chargement...</p>
            </div>
            <button
                v-if="hasMore && books.length > 0"
                @click="loadMoreUserBook"
                :disabled="isLoading"
                id="seeMore"
                >
                    {{ isLoading ? 'Chargement...' : 'Voir plus' }}
            </button>
        </section>
    </div>
</template>

<style>
</style>