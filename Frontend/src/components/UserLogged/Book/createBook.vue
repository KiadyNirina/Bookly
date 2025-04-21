<script>
import ErrorPopup from './ErrorPopup.vue';
import SuccessPopup from './SuccessPopup.vue';
import { useUser } from '@/composables/useUser';
import { useBook } from '@/composables/useBook';

export default {
  components: { 
    ErrorPopup, 
    SuccessPopup 
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const { createBook, isLoading, error, success } = useBook()
    const { user, isLoggedIn } = useUser()
    
    return {
      createBook,
      isLoading,
      error,
      success,
      user,
      isLoggedIn
    }
  },

  watch: {
    visible(newValue) {
      if (!newValue) {
        this.isClosing = true; 
        setTimeout(() => {
          this.isClosing = false; 
          this.$emit('close'); 
        }, 300);
      }
    },
    error(newError) {
      if (newError) {
        this.showError(newError)
      }
    },
    success(newSuccess) {
      if (newSuccess) {
        this.showSuccess(newSuccess)
        this.resetForm()
      }
    }
  },

  data() {
    return {
      title: '',
      author: '',
      description: '',
      genre: '',
      lang: '',
      page: '',
      picture: null, // Pour stocker l'image
      file: null, // Pour stocker le fichier numérique
      errorMessage: '',
      hasError: false,
      successMessage: '',
      isLoading: false,
      popupErrorVisible: false,
      popupSuccessVisible: false,
      isClosing: false,
    };
  },

  methods: {
    handleFileChange(event, type) {
      const file = event.target.files[0];

      if (!file) {
        this.showError('Aucun fichier sélectionné.');
        return;
      }

      if (type === 'picture') {
        const allowedImageFormats = ['image/jpeg', 'image/png'];
        if (!allowedImageFormats.includes(file.type)) {
          this.showError('Format de fichier image non valide. Veuillez sélectionner un fichier JPEG ou PNG.');
          return;
        }
        this.picture = file;
        document.getElementById('file-name-picture').textContent = file.name;
      } else if (type === 'file') {
        const allowedFormats = ['application/pdf', 'application/msword'];
        if (!allowedFormats.includes(file.type)) {
          this.showError('Format de fichier non valide. Veuillez sélectionner un fichier PDF ou DOC.');
          return;
        }
        this.file = file;
        document.getElementById('file-name-file').textContent = file.name;
      }
    },

    async create() {
      if (!this.isLoggedIn) {
        this.showError('Utilisateur non connecté. Veuillez réessayer.');
        return;
      }

      if (!this.title || !this.author || !this.description || !this.genre || !this.lang || !this.page) {
        this.showError('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      if (!this.file) {
        this.showError('Veuillez importer le livre version numérique.');
        return;
      }

      this.isLoading = true;

      try {
        await this.createBook({
          title: this.title,
          author: this.author,
          description: this.description,
          genre: this.genre,
          lang: this.lang,
          page: this.page,
          picture: this.picture,
          file: this.file
        })
        console.log('Ajout avec succès :', response);
        this.resetForm();
        this.showSuccess("Ajout du livre avec succès!");
      } catch (error) {
        this.showError("Une erreur est survenue lors de l'ajout du livre.");
        console.error('Erreur lors de l’ajout :', error);
      } finally {
        this.isLoading = false;
      }
    },

    showError(message) {
      this.errorMessage = message;
      this.popupErrorVisible = true;
    },

    showSuccess(message) {
      this.successMessage = message;
      this.popupSuccessVisible = true;
    },

    resetForm() {
      this.title = '';
      this.author = '';
      this.description = '';
      this.genre = '';
      this.lang = '';
      this.page = '';
      this.picture = null;
      this.file = null;
      this.errorMessage = '';
      this.hasError = false;
      this.popupErrorVisible = false;
    },

    closePopup() {
      this.isClosing = true;
      setTimeout(() => {
        this.isClosing = false;
        this.$emit('close');
      }, 300);
    },
  },
};
</script>

<template>
  <div v-if="visible || isClosing" :class="['popup-overlay', { closing: isClosing }]">
    <div :class="['popup-content', { closing: isClosing }]">
      <h1>Créer un livre</h1>
      <form @submit.prevent="create">
        <div class="form">
          <div class="file">
            <div class="file1">
              <label for="file-upload-picture" class="custom-file-upload">Photo de couverture :</label>
              <span class="file-name" id="file-name-picture">Aucun fichier choisi</span>
              <input id="file-upload-picture" type="file" @change="handleFileChange($event, 'picture')" />
            </div>
            <div class="file1">
              <label for="file-upload-file" class="custom-file-upload">Fichier numérique (pdf, doc) :</label>
              <span class="file-name" id="file-name-file">Aucun fichier choisi</span>
              <input id="file-upload-file" type="file" @change="handleFileChange($event, 'file')" />
            </div>
          </div>
          <div class="input">
            <label for="">Titre :</label>
            <input type="text" v-model="title" placeholder="Titre" />

            <label for="">Auteur :</label>
            <input type="text" v-model="author" placeholder="Auteur" />

            <label for="">Description :</label>
            <textarea v-model="description" placeholder="Description"></textarea>

            <label for="">Genre :</label>
            <select v-model="genre">
              <option value="" disabled>Selectionnez le genre</option>
              <option value="action">Action</option>
              <option value="romance">Romance</option>
              <option value="comedie">Comédie</option>
              <option value="fiction">Fiction</option>
              <option value="autre">Autre</option>
            </select>
            <div class="nbr">
              <div class="nbr1">
                <label for="">Langue :</label>
                <input type="text" v-model="lang" placeholder="Langue" />
              </div>
              <div class="nbr1">
                <label for="">Page :</label>
                <input type="number" v-model="page" placeholder="Nombre de pages" />
              </div>
            </div>
          </div>
        </div>
        <div class="button">
          <button type="submit" :disabled="isLoading">{{ isLoading ? "Chargement..." : "Ajouter" }}</button>
          <button type="button" @click="closePopup">Annuler</button>
        </div>
        <ErrorPopup
          :message="errorMessage"
          :visible="popupErrorVisible"
          @close="popupErrorVisible = false"
        />
        <SuccessPopup
          :message="successMessage"
          :visible="popupSuccessVisible"
          @close="popupSuccessVisible = false"
        />
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
  opacity: 0;
  animation: slideDown 0.3s forwards;
}

.popup-overlay.closing {
  animation: fadeOut 0.3s forwards;
}

.popup-content {
  background: #060818;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0px 15px rgba(255, 255, 255, 0.087);
  color: white;
  opacity: 0;
  animation: slideDown 0.3s forwards;
  max-width: 70%;
}

.popup-content.closing {
  animation: slideUp 0.3s forwards;
}

.form{
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.065);
  padding: 10px;
  border-radius: 10px;
  align-items: center;
}

.form .file .file1 input{
  display: none;
}

.custom-file-upload {
    display: inline-block;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 10px;
    font-size: 16px;
    transition: 0.3s;
}

.custom-file-upload:hover {
    background-color: #0056b3;
}

.file-name {
    margin-left: 10px;
    font-size: 14px;
    color: #575757;
}

.form .file .file1 {
  text-align: start;
  padding: 10px;
  font-family: 'Poppins';
  font-size: 15px;
  color: rgba(255, 255, 255, 0.696);
}

.form .input , .form .file{
  width: 50%;
}

.form .input input, .form .input select, .form .input textarea {
  width: calc(100% - 15px);
  padding-left: 10px;
  height: 40px;
  margin: 3px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.048);
  border-radius: 10px;
  background-color: transparent;
  color: white;
  font-family: 'Poppins';
}

.form .input textarea{
  height: 100px;
  text-align: start;
}

.form .input label {
  color: rgb(219, 219, 219);
  margin-left: 3px;
  font-family: "poppins";
  font-size: 12px; 
}

.form .input .nbr{
  display: flex;
  width: 100%;
}

.form .input .nbr .nbr1 {
  width: 50%;
  margin-right: 5px;
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
  font-family: 'Poppins';
}

button:hover {
  background: #274e9167;
}
</style>