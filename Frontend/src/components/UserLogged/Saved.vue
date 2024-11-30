<script>
export default {
    methods: {
        isActive(route) {
            return this.$route.path === route;
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
                <router-link :to="'/profil/create'" :id="isActive('/profil/create') ? 'active-link' : ''">Créees</router-link>
                <router-link :to="'/profil/saved'" :id="isActive('/profil/saved') ? 'active-link' : ''">Enregistrées</router-link>
            </div>
            <p>Saved</p>
    </div>
</template>