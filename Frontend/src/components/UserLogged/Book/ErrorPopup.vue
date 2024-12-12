<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '', // Pour éviter les erreurs si aucun message n'est passé
    },
  },

  methods: {
    closePopup() {
      this.$emit('close');
    },
  },
};
</script>

<template>
    <div v-if="visible" class="popup-overlay">
      <div class="popup-content">
        <h1>Erreur <span @click="closePopup">X</span></h1>
        <p>{{ message }}</p>
      </div>
    </div>
</template>

<style>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fond sombre semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #fff; /* Fond blanc */
  border-radius: 8px; /* Coins arrondis */
  padding: 20px;
  width: 90%; /* Taille par défaut pour mobile */
  max-width: 400px; /* Taille maximale */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ombre subtile */
  text-align: center;
}

.popup-content h1 {
  font-size: 1.5rem;
  color: #d9534f; /* Rouge pour signaler une erreur */
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-content p {
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
}

.close-btn {
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  background: none;
  border: none;
  outline: none;
  padding: 5px;
}

.close-btn:hover {
  color: #d9534f; /* Rouge lorsqu'on survole */
}

</style>