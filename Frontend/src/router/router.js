import { createRouter , createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Books from '@/components/Books.vue';
import Popular from '@/components/books/Popular.vue';
import Detail from '@/components/books/detail/Detail.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/books', component: Books },
    { path: '/books/popular', component: Popular },
    { path: '/books/popular/detail', component: Detail},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
