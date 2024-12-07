<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closePopup() {
      this.$emit('close'); // Émet un événement pour fermer le popup
    },
  },
};
</script>

<template>
    <div v-if="visible" class="popup-overlay">
      <div class="popup-content">
        <h1>Créer un épingle</h1>
        <form method="post">
          <div class="form">
            <div class="file">
              <div class="file1">
                <label for="">Choisissez la photo de couverture du livre :</label>
                <input type="file" name="" id="">
              </div>
              <div class="file1">
                <label for="">Choisissez le livre au format numérique (pdf, doc) :</label>
                <input type="file" name="" id="">
              </div>
            </div>
            <div class="input">
              <input type="text" name="" id="" placeholder="Titre">
              <input type="text" placeholder="Auteur">
              <textarea name="" id="" placeholder="Description"></textarea>
              <select name="" id="">
                <option value="" disabled>Selectionnez le genre</option>
                <option value="">Action</option>
                <option value="">Romance</option>
                <option value="">Comédie</option>
                <option value="">Fiction</option>
                <option value="">Autre</option>
              </select>
              <div class="nbr">
                <input type="text" placeholder="Entrer la langue du livre">
                <input type="number" name="" id="" placeholder="Nombre de page">
              </div>
            </div>
          </div>
          <div class="button">
            <button @click="closePopup">Ajouter</button>
            <button @click="closePopup">Annuler</button>
          </div>
        </form>
      </div>
    </div>
 </template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #060818;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0px 15px rgba(255, 255, 255, 0.192);
  color: white;
}

.form{
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.022);
  padding: 10px;
  border-radius: 10px;
  align-items: center;
}

.form .file .file1 input{
  border-radius: 10px;
  display: block;
  width: 100%;
  height: 30px;
  margin: 3px;
  color: white;
}

.form .file .file1 input:hover{
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.155);
}

.form .file .file1 {
  text-align: start;
  padding: 10px;
  font-family: 'Poppins';
  font-size: 12px;
  color: rgba(255, 255, 255, 0.696);
}

.form .input , .form .file{
  width: 50%;
}

.form .input input, .form .input select, .form .input textarea {
  width: 100%;
  padding: 0px;
  height: 40px;
  margin: 3px;
  border: 1px solid rgba(255, 255, 255, 0.085);
  border-radius: 10px;
  background-color: transparent;
  color: white;
  text-align: center;
}

.form .input textarea{
  height: 100px;
  text-align: start;
}

.form .input .nbr{
  display: flex;
}

.form .input option {
  color: black;
}

button {
  background: #4388ff67;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background: #274e9167;
}
</style>