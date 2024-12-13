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
      }, 300); 
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
        :class="['popupSuccess-content', { closing: isClosing }]"
        >
        <h1>
            Succès
            <span class="closeSuccess-btn" @click="closePopup">X</span>
        </h1>
        <p>{{ message }}</p>
        </div>
    </div>
</template>

<style>

.popupSuccess-content {
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

.popupSuccess-content.closing {
  animation: slideUp 0.3s forwards;
}

.popupSuccess-content h1 {
  font-size: 18px;
  color: #48b642;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.popupSuccess-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.737);
  margin-bottom: 50px;
}

.closeSuccess-btn {
  cursor: pointer;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.752);
  background-color: #48b642;
  border-radius: 5px;
  border: none;
  outline: none;
  padding: 5px;
}

.closeSuccess-btn:hover {
  color: #404040;
}

</style>