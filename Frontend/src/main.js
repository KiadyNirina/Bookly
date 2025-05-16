import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router'; // Importation du routeur Vue
//import store from './store'; // Importation du store (Vuex)
import apiClient from './plugins/axios'; // Configuration globale de axios
import './assets/global.css'; // Importation du fichier CSS principal

const app = createApp(App);

// Injection globale d'axios
app.config.globalProperties.$api = apiClient;

app.use(router);
//app.use(store);
app.mount('#app');
