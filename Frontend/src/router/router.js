import { createRouter , createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Books from '@/components/Books.vue';
import Popular from '@/components/books/Popular.vue';
import Detail from '@/components/books/detail/Detail.vue';
import Login from '@/components/Login.vue';
import Signup from '@/components/Signup.vue';
import dashboard from '@/components/UserLogged/dashboard.vue';
import Biblio from '@/components/UserLogged/Biblio.vue';
import User from '@/components/UserLogged/ProfilUser/User.vue';
import UserSaved from '@/components/UserLogged/ProfilUser/UserSaved.vue';
import Saved from '@/components/UserLogged/Profil/Saved.vue';
import Create from '@/components/UserLogged/Profil/Create.vue';
import Posted from '@/components/books/Posted.vue';
import Recent from '@/components/books/Recent.vue';
import BookReader from '@/components/books/BookReader.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/books', component: Books },
    { path: '/books/popular', component: Popular },
    { path: '/books/:id', component: Detail},
    { path: '/book/:id/file', component: BookReader, props: true },
    { path: '/books/posted', component: Posted },
    { path: '/books/recent', component: Recent },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/dashboard', component: dashboard },
    { path: '/biblio', component: Biblio },
    { path: '/user/:id/create', component: User },
    { path: '/user/:id/saved', component: UserSaved },
    { path: '/profil/create', component: Create },
    { path: '/profil/saved', component: Saved },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active-link'
});

export default router;
