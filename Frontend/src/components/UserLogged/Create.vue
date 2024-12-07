<script>
import CreateBook from './Book/createBook.vue';
import Swal from 'sweetalert2';

export default {
    components: { CreateBook },
    data() {
        return {
            popupVisible: false, // Contrôle la visibilité du popup
        };
    },
    methods: {
        isActive(route) {
            return this.$route.path === route;
        },
        create() {
            this.popupVisible = true; // Affiche le popup
        },
    },
};
</script>

<template>
    <div class="profil">
        <h1 id="pdp">K</h1>
        <!-- <img src="../../../public/icons/user.png" alt=""> -->
            <h1>Kiady Rambeloson</h1>
            <div class="followers">
                <p><b>1k</b> suivi(e)s</p>
                <p><b>0</b> abonnements</p>
            </div>
            <div class="button">
                <button>Partager</button>
                <router-link to="">Modifier le profil</router-link>
            </div>
            <div class="section">
                <a href="/profil/create" :id="isActive('/profil/create') ? 'act-link' : ''">Créees</a>
                <a href="/profil/saved" :id="isActive('/profil/saved') ? 'act-link' : ''">Enregistrées</a>
            </div>
            <div class="profil-content">
                <p>Rien à afficher… pour l’instant ! Les Épingles que vous créez s’installeront ici.</p>
                <div class="button">
                    <button id="buttonProfil" @click="create()">Créer</button>
                </div>
            </div>

            <CreateBook
                            :message="'Merci pour votre note de étoiles!'"
                            :visible="popupVisible"
                            @close="popupVisible = false"
                        /> 
    </div>
    
</template>

<style>
.profil-content{
    margin-top: 50px;
}
.profil-content p{
    display: flex;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    color: white;
    font-family: 'Poppins';
    font-size: 12px;
}
#buttonProfil{
    background-color: #4388ff67;
}
#buttonProfil:hover{
    background-color: #274e9167;
}
</style>