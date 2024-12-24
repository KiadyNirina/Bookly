<script>
</script>

<template>
    <div class="content-page">
        <div class="tri">
            <a href="">Romance</a>
            <a href="">Fantaisie</a>
            <a href="">Histoire</a>
            <a href="">Fiction</a>
            <a href="">Non fiction</a>
            <a href="">Comédie</a>
            <a href="">Action</a>
        </div>

        <section class="popular-books">
            <h2>Les livres les plus récents</h2>

            <div v-if="books.length != 0" class="row">
                <div class="books" v-for="(book, index) in books" :key="index">
                    <a :href="`/books/${book.id}`">
                        <div class="img">
                            <img :src="book.picture ? getImageUrl(book.picture) : getImageUrl(defaultImg)" :alt="book.title" />
                        </div>
                        <div class="info">
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author }}</p>
                            <p id="poste">
                            Publié par <b>{{ book.posted_by.name }}</b>,<br>
                            Le <b>{{ book.created_at }}</b>,<br>
                            Lang : <b>{{ book.lang }}</b>
                            </p>
                            <div class="content-book">
                                <div class="note">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note-active.png" alt="">
                                    <img src="../../../public/icons/note.png" alt="">
                                </div>
                                <span>👀1,3k</span>
                                <span><img src="../../../public/icons/coms.png" alt="">150</span>
                                <span><img src="../../../public/icons/download.png" alt=""> 900</span>
                            </div>
                        </div>
                        <div class="desc">
                            <p id="type">{{ book.type }}</p>
                            <p>{{ book.description }}</p>
                            <div class="action">
                                <a href="#save" class="actionButton"><img src="../../../public/icons/save.png" alt=""></a>
                                <a href="#save" class="actionButton"><img src="../../../public/icons/modifier.png" alt=""></a>
                                <a href="#download" class="actionButton"><img src="../../../public/icons/supprimer.png" alt=""></a>
                                <a href="#download" class="actionButton"><img src="../../../public/icons/partager.png" alt=""></a>
                            </div>
                        </div>
                    </a>
                </div>

                <button v-if="hasMoreBooks" @click="loadMoreBooks" id="seeMore">Voir Plus</button>
            </div>
            <div v-else class="">
                <p>Chargement...</p>
            </div>

        </section>
    </div>
</template>

<style>
.row .books a{
    display: flex;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    transition: 0.2s;
    border: 1px solid #4388ff27;
    border-radius: 20px;
    text-decoration: none;
}
.row .books .img{
    height: 200px;
    width: 30%;
    border-radius: 0px;
}
.row .books .img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px 0px 0px 20px;
}
.row .books a:hover{
  box-shadow: 0px 0px 10px #3355ffc2;
}
.row .books .info {
    padding: 10px;
    width: 30%;
}
.row .info h3{
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-transform: uppercase;
  color: #4388ff;
  margin: 0;
}

.row .info p{
  color: rgba(255, 255, 255, 0.52);
  margin: 0;
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.row .content-book {
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
}
.row .content-book span{
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: auto;
  font-family: 'Courier New', Courier, monospace;
  color: rgba(255, 255, 255, 0.722);
}
#poste{
    font-size: 15px;
    margin: 10px 0px 10px 0px;
}
.row .books .content-book span img{
  height: 13px;
  width: auto;
  margin-right: 2px;
}
.row .books .desc{
    width: 40%;
    padding: 5px;
    color: rgba(255, 255, 255, 0.434);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.row .books .desc #type{
    text-align: center;
    background-color: #4388ff28;
}
.row .books .desc .action{
    display: flex;
    justify-content: right;
    padding-right: 10px;
}
.row .books .desc .action .actionButton{
    padding: 10px;
    border-radius: 10px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.842);
    font-weight: bold;
    width: auto;
    border: none;
}
.row .books .desc .action .actionButton:hover{
    background-color: rgba(128, 128, 128, 0.197);
    box-shadow: none;
}
.row .books .desc .action .actionButton img{
    height: 20px;
    margin: 0;
}
</style>