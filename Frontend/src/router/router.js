import { createRouter , createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Books from '@/components/Books.vue';
import Popular from '@/components/books/Popular.vue';
import Detail from '@/components/books/detail/Detail.vue';
import Login from '@/components/Login.vue';
import Signup from '@/components/Signup.vue';
import dashboard from '@/components/UserLogged/dashboard.vue';
import Biblio from '@/components/UserLogged/Biblio.vue';
import UserProfile from '@/components/UserLogged/UserProfile.vue';
import Saved from '@/components/UserLogged/Saved.vue';
import Create from '@/components/UserLogged/Create.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/books', component: Books },
    { path: '/books/popular', component: Popular },
    { path: '/books/detail', component: Detail},
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/dashboard', component: dashboard },
    { path: '/biblio', component: Biblio },
    { path: '/profil', component: UserProfile },
    { path: '/profil/create', component: Create },
    { path: '/profil/saved', component: Saved },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active-link'
});

export default router;
