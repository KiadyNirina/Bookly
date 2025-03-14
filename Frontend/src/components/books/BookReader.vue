<template>
    <div class="book-viewer">
      <h1>{{ bookTitle }}</h1>
      <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="600px"></iframe>
      <p v-else>Chargement du livre...</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const route = useRoute();
      const bookTitle = ref('');
      const pdfUrl = ref('');
  
      onMounted(async () => {
        try {
          const bookId = route.params.id;
          const response = await axios.get(`http://localhost:8000/api/books/${bookId}`);
          bookTitle.value = response.data.title;
  
          const fileResponse = await axios.get(`http://localhost:8000/api/books/${bookId}/file`, {
            responseType: 'blob'
          });
  
          pdfUrl.value = URL.createObjectURL(fileResponse.data);
        } catch (error) {
          console.error("Erreur lors du chargement du livre", error);
        }
      });
  
      return { bookTitle, pdfUrl };
    }
  };
  </script>
  
  <style>
  .book-viewer {
    text-align: center;
    padding: 20px;
  }
  </style>
  