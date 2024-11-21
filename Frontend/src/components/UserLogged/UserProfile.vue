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

    </div>
</template>

<style>
.profil{
    margin-left: auto;
    margin-right: auto;
    max-width: 1300px;
    justify-content: center;
    padding: 100px;
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
    font-size: 35px;
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
    font-size: 20px;
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
</style>