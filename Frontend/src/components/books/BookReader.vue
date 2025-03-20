<template>
  <div class="content-page">
    <!-- Affichage des informations du livre -->
    <div v-if="book">
      <h1>{{ book.title }}</h1>
      <p>{{ book.author }}</p>
    </div>

    <!-- Conteneur pour le lecteur EPUB -->
    <div ref="epubContainer" class="epub-container"></div>

    <!-- Contrôles de personnalisation -->
    <div class="controls">
      <button @click="increaseFontSize">Agrandir le texte</button>
      <button @click="decreaseFontSize">Réduire le texte</button>
      <button @click="toggleNightMode">Mode nuit</button>
      <select v-model="selectedFont" @change="changeFont">
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
    </div>
  </div>
</template>

<script>
import Epub from 'epubjs';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      book: null, // Détails du livre
      rendition: null, // Instance du lecteur EPUB
      selectedFont: 'Arial', // Police sélectionnée
      nightMode: false, // Mode nuit activé/désactivé
    };
  },
  async mounted() {
    // Charger les détails du livre et le fichier EPUB
    await this.fetchBookDetails();
    this.loadEpub();
  },
  methods: {
    // Récupérer les détails du livre depuis l'API Laravel
    async fetchBookDetails() {
      try {
        const response = await fetch(`http://localhost:8000/api/books/${this.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        this.book = data.data;
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },

    // Charger le fichier EPUB dans le lecteur
    async loadEpub() {
      if (!this.book.file) {
        console.error('No EPUB file found');
        return;
      }

      // Détruire le lecteur existant s'il y en a un
      if (this.rendition) {
        this.rendition.destroy();
      }

      // Créer une nouvelle instance du lecteur EPUB
      this.rendition = await Epub(`http://localhost:8000/storage/${this.book.file}`).renderTo(this.$refs.epubContainer, {
        width: '100%',
        height: '600px',
      });

      // Afficher la première page
      await this.rendition.display();
    },

    // Augmenter la taille du texte
    increaseFontSize() {
      this.rendition.themes.fontSize('120%');
    },

    // Réduire la taille du texte
    decreaseFontSize() {
      this.rendition.themes.fontSize('80%');
    },

    // Activer/désactiver le mode nuit
    toggleNightMode() {
      this.nightMode = !this.nightMode;
      this.rendition.themes[this.nightMode ? 'night' : 'default']();
    },

    // Changer la police
    changeFont() {
      this.rendition.themes.font(this.selectedFont);
    },
  },
};
</script>

<style>
.epub-container {
  margin: 20px auto;
  border: 1px solid #ccc;
  height: 600px; /* Hauteur fixe pour le conteneur */
  width: 100%; /* Largeur maximale */
}

.controls {
  margin-top: 10px;
}

button, select {
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

button:hover, select:hover {
  background-color: #f0f0f0;
}
</style>