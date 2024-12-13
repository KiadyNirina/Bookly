<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isClosing: false, 
    };
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
  },
  methods: {
    closePopup() {
      this.isClosing = true;
      setTimeout(() => {
        this.isClosing = false;
        this.$emit('close');
      }, 300); // Durée de l'animation
    },
  },
};
</script>

<template>
  <div
    v-if="visible || isClosing"
    :class="['popupError-overlay', { closing: isClosing }]"
  >
    <div
      :class="['popupError-content', { closing: isClosing }]"
    >
      <h1>
        Erreur 
        <span class="closeError-btn" @click="closePopup">X</span>
      </h1>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style>
.popupError-overlay {
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
  animation: fadeIn 0.3s forwards;
}

.popupError-overlay.closing {
  animation: fadeOut 0.3s forwards;
}

.popupError-content {
  background: #060818; 
  border-radius: 8px; 
  padding: 0;
  width: 90%; 
  max-width: 400px; 
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2); 
  text-align: center;
  opacity: 0;
  animation: slideDown 0.3s forwards;
}

.popupError-content.closing {
  animation: slideUp 0.3s forwards;
}

.popupError-content h1 {
  font-size: 18px;
  color: #d9534f;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.popupError-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.737);
  margin-bottom: 50px;
}

.closeError-btn {
  cursor: pointer;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.752);
  background-color: #d9534f;
  border-radius: 5px;
  border: none;
  outline: none;
  padding: 5px;
}

.closeError-btn:hover {
  color: #404040;
}

/* Animation pour l'apparition du fond */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animation pour la disparition du fond */
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Animation pour l'apparition du contenu */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pour la disparition du contenu */
@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

</style>