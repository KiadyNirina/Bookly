import { createRouter , createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Books from '@/components/Books.vue';

const routes = [
    { path: '/home', component: Home },
    { path: '/books', component: Books },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
