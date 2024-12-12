<script>
import api from '@/api';
import ErrorPopup from './ErrorPopup.vue';

export default {
  components: { ErrorPopup },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      user: null,
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
      isLoading: false,
      popupErrorVisible: false,
    };
  },

  methods: {
    async fetchUser() {
      try {
        const userData = await api.getUser();
        this.user = userData.user;
        console.log('Informations de l’utilisateur connecté :', userData);
      } catch (error) {
        this.showError('Impossible de récupérer les informations utilisateur.');
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    },

    handleFileChange(event, type) {
      const file = event.target.files[0];

      // Validation basique
      if (!file) {
        this.showError('Aucun fichier sélectionné.');
        return;
      }

      if (type === 'picture') {
        this.picture = file;
      } else if (type === 'file') {
        const allowedFormats = ['application/pdf', 'application/msword'];
        if (!allowedFormats.includes(file.type)) {
          this.showError('Format de fichier non valide. Veuillez sélectionner un fichier PDF ou DOC.');
          return;
        }
        this.file = file;
      }
    },

    async createBook() {
      if (!this.user) {
        this.showError('Utilisateur non connecté. Veuillez réessayer.');
        return;
      }

      if (!this.title || !this.author || !this.description || !this.genre || !this.lang || !this.page) {
        this.showError('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      this.isLoading = true;

      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('author', this.author);
      formData.append('description', this.description);
      formData.append('genre', this.genre);
      formData.append('posted_by', this.user.id);
      formData.append('lang', this.lang);
      formData.append('page', this.page);
      if (this.picture) formData.append('picture', this.picture);
      if (this.file) formData.append('file', this.file);

      try {
        const response = await api.bookCreate(formData);
        console.log('Ajout avec succès :', response);
        this.resetForm();
        this.$router.push('/profil/create');
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
      this.$emit('close');
    },
  },

  mounted() {
    this.fetchUser();
  },
};
</script>

<template>
  <div v-if="visible" class="popup-overlay">
    <div class="popup-content">
      <h1>Créer un livre</h1>
      <form @submit.prevent="createBook">
        <div class="form">
          <div class="file">
            <div class="file1">
              <label>Photo de couverture :</label>
              <input type="file" @change="handleFileChange($event, 'picture')" />
            </div>
            <div class="file1">
              <label>Fichier numérique (pdf, doc) :</label>
              <input type="file" @change="handleFileChange($event, 'file')" />
            </div>
          </div>
          <div class="input">
            <input type="text" v-model="title" placeholder="Titre" />
            <input type="text" v-model="author" placeholder="Auteur" />
            <textarea v-model="description" placeholder="Description"></textarea>
            <select v-model="genre">
              <option value="" disabled>Selectionnez le genre</option>
              <option value="action">Action</option>
              <option value="romance">Romance</option>
              <option value="comedie">Comédie</option>
              <option value="fiction">Fiction</option>
              <option value="autre">Autre</option>
            </select>
            <div class="nbr">
              <input type="text" v-model="lang" placeholder="Langue" />
              <input type="number" v-model="page" placeholder="Nombre de pages" />
            </div>
          </div>
        </div>
        <div class="button">
          <button v-if="isLoading" disabled>Chargement...</button>
          <button v-else type="submit">Ajouter</button>
          <button type="button" @click="closePopup">Annuler</button>
        </div>
        <ErrorPopup
          :message="errorMessage"
          :visible="popupErrorVisible"
          @close="popupErrorVisible = false"
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
  font-size: 15px;
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