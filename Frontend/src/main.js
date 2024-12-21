// import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router/router';
import userMixin from './mixins/userMixin';
import BooksMixin from './mixins/BooksMixin';

axios.defaults.baseURL = 'http://localhost:8000/api';

const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.mixin(userMixin);
app.mixin(BooksMixin);

app.use(router).mount('#app');
