import { createRouter , createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Books from '@/components/Books.vue';
import Popular from '@/components/books/popular.vue';

const routes = [
    { path: '/home', component: Home },
    { path: '/books', component: Books },
    { path: '/books/popular', component: Popular },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
