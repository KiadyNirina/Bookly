<script setup>
</script>

<template>
  <main>
    <div class="nav">
        <div class="nav-left">
            <img src="../../public/logo.jpg" alt="Logo">
        </div>
        <div class="search">
            <input type="search" name="" id="" placeholder="Recherche">
        </div>
        <div class="nav-right">
            <router-link to="/home">Accueil</router-link>
            <router-link to="/books">Livres</router-link>
            <router-link to="/">A propos</router-link>
            <router-link to="/">Contact</router-link>
            <router-link to="/" id="button">Connexion</router-link>
        </div>
    </div>
    <router-view></router-view>
  </main>
</template>

<style scoped>
.nav{
    display: flex;
    align-items: center;
    background-color: #010310;
    padding: 5px;
    position: fixed;
    width: 100%;
    z-index: 10;
}
.nav a{
    text-decoration: none;
    color: #F5F5DC;
    transition: 0.5s;
}
.nav a:hover{
    color: #E67E22;
}
.nav-left{
    width: auto;
}
.nav-left img{
    height: 50px;
    border-radius: 100%;
}
.search{
    width: 60%;
    margin-left: auto;
    margin-right: auto;
}
.search input{
    width: 100%;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.119);
    border-radius: 20px;
    background-color: transparent;
    padding: 10px;
    color: white;
    transition: 0.3s;
}
.search input:hover{
    background-color: rgba(255, 255, 255, 0.089);
}
.nav-right{
    margin-left: auto;
    width: auto;
    display: flex;
    align-items: center;
}
.nav-right a{
    margin-left: 10px;
    margin-right: 10px;
}
#button{
    background-color: #E67E22;
    padding: 10px;
    border-radius: 20px;
    border: 2px solid #E67E22;
    transition: 0.5s;
}
#button:hover{
    background-color: transparent;
    color: #E67E22;
}
</style>
