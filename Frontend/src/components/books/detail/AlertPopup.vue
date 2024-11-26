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
        this.$emit('close');
      },
    },
  };
</script>

<template>
    <div v-if="visible" class="popup-overlay">
      <div class="popup-content">
        <p>{{ message }}</p>
        <button @click="closePopup">OK</button>
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
    background-color: #00162e;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 0px 10px rgba(0, 0, 255, 0.301);
  }

  .popup-content p{
    color: black;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
</style>
  