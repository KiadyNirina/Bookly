<script>
// import api from '@/api';

// export default {
//     data() {
//         return {
//             userOne: null,
//         }
//     },
//     methods: {
//         isActive(route) {
//             return this.$route.path === route;
//         },
//         async getUserOne() {
//             try {
//                 const idUser = this.$route.params.id;
//                 const response = await api.getOneUser(idUser);
//                 this.userOne = response.data;
//             } catch (error) {
//                 console.error("Erreur de récupération de donnée de l utilisateur :",error);
//             }
//         },
//     },
//     created() {
//         this.getUserOne();
//     }
// };
</script>

<template>
    <!-- <div v-if="userOne" class="profil">
        <h1 id="pdp">K</h1>
            <h1>{{ userOne.data.name }}</h1>
            <div class="followers">
                <p><b>1k</b> suivi(e)s</p>
                <p><b>0</b> abonnements</p>
            </div>
            <div class="button">
                <button>S'abonner</button>
            </div>
            <div class="section">
                <a :href="`/user/${userOne.data.id}/create`" :id="isActive(`/user/${userOne.data.id}/create`) ? 'act-link' : ''">Créees</a>
                <a :href="`/user/${userOne.data.id}/saved`" :id="isActive(`/user/${userOne.data.id}/saved`) ? 'act-link' : ''">Enregistrées</a>
            </div>
            <div class="profil-content">
                <p>Rien à afficher… pour l’instant ! Les Épingles que {{ userOne.data.name }} crée s’afficheront ici.</p>
            </div>
    </div>
    <div v-else class="profil">
        <h1 id="pdp">K</h1>
            <h1>Chargement...</h1>
            <div class="followers">
                <p><b>1k</b> suivi(e)s</p>
                <p><b>0</b> abonnements</p>
            </div>
            <div class="button">
                <button>S'abonner</button>
            </div>
    </div> -->
</template>

<style>
.profil{
    margin-left: auto;
    margin-right: auto;
    max-width: 1300px;
    justify-content: center;
    padding: 50px;
}
#pdp {
    color: white;
    font-size: 50px;
    text-align: center;
    background: rgba(255, 255, 255, 0.253);
    padding: 20px;
    width: 60px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 100%;
}
.profil h1{
    text-align: center;
    color: white;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.profil img{
    height: 120px;
    border: 1px solid white;
    border-radius: 100%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
}
.followers{
    display: flex;
    justify-content: center;
}
.followers p{
    color: white;
    margin: 10px;
}
.button {
    display: flex;
    align-items: center;
    justify-content: center;
}
.button button, .button a {
    font-size: 15px;
    background: rgba(255, 255, 255, 0.253);
    text-decoration: none;
    color: white;
    padding: 15px;
    border-radius: 30px;
    border: none;
    margin: 5px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.button button:hover, .button a:hover{
    background: rgb(128, 128, 128);
    cursor: pointer;
}
.section{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.section a{
    padding: 10px;
    color: white;
    text-decoration: none;
}
.section a:hover{
    background-color: rgba(255, 255, 255, 0.1);
}
#act-link{
    color: #E67E22;
    border-bottom: 1px solid #E67E22;
}
</style>