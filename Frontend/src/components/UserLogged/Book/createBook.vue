<script setup>
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ErrorPopup from './ErrorPopup.vue';
import SuccessPopup from './SuccessPopup.vue';
import { useUser } from '@/composables/useUser';
import { useBook } from '@/composables/useBook';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const { createBook, isLoading, error, success } = useBook();
const { user, isLoggedIn } = useUser();

// Données du formulaire
const formData = ref({
  title: '',
  author: '',
  description: '',
  genre: '',
  lang: '',
  page: '',
  picture: null,
  file: null
});

const isClosing = ref(false);
const popupErrorVisible = ref(false);
const popupSuccessVisible = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const genreOptions = ref([
  { value: '', label: 'Sélectionnez le genre', disabled: true },
  { value: 'action', label: 'Action' },
  { value: 'romance', label: 'Romance' },
  { value: 'comedie', label: 'Comédie' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'fantastique', label: 'Fantastique' },
  { value: 'science-fiction', label: 'Science-fiction' },
  { value: 'historique', label: 'Historique' },
  { value: 'biographie', label: 'Biographie' },
  { value: 'autre', label: 'Autre' }
]);

const langOptions = ref([
  { value: '', label: 'Sélectionnez la langue', disabled: true },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'autre', label: 'Autre' }
]);

watch(() => props.visible, (newValue) => {
  if (!newValue) {
    isClosing.value = true;
    setTimeout(() => {
      isClosing.value = false;
      emit('close');
    }, 300);
  }
});

watch(error, (newError) => {
  if (newError) {
    showError(newError);
  }
});

watch(success, (newSuccess) => {
  if (newSuccess) {
    showSuccess(newSuccess);
    resetForm();
  }
});

const handleFileChange = (event, type) => {
  const file = event.target.files[0];

  if (!file) {
    showError('Aucun fichier sélectionné.');
    return;
  }

  if (type === 'picture') {
    const allowedImageFormats = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif'
    ];

    if (!allowedImageFormats.includes(file.type)) {
      showError(
        `Format d'image non supporté. Formats acceptés : JPEG, PNG, WebP, SVG, GIF`
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('L\'image ne doit pas dépasser 5MB.');
      return;
    }

    formData.value.picture = file;
  } else if (type === 'file') {
    const allowedFormats = [
      'application/pdf', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedFormats.includes(file.type)) {
      showError('Format de fichier non valide. Veuillez sélectionner un fichier PDF ou DOC/DOCX.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showError('Le fichier ne doit pas dépasser 20MB.');
      return;
    }

    formData.value.file = file;
  }
};

const create = async () => {
  if (!isLoggedIn) {
    showError('Vous devez être connecté pour créer un livre.');
    return;
  }

  const requiredFields = ['title', 'author', 'description', 'genre', 'lang', 'page'];
  const missingFields = requiredFields.filter(field => !formData.value[field]);

  if (missingFields.length > 0) {
    showError('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  if (!formData.value.file) {
    showError('Veuillez importer le livre version numérique.');
    return;
  }

  try {
    await createBook(formData.value);
  } catch (err) {
    showError("Une erreur est survenue lors de l'ajout du livre.");
    console.error('Erreur lors de l\'ajout :', err);
  }
};

const showError = (message) => {
  errorMessage.value = message;
  popupErrorVisible.value = true;
};

const showSuccess = (message) => {
  successMessage.value = message;
  popupSuccessVisible.value = true;
  setTimeout(() => {
    closePopup();
  }, 2000);
};

const resetForm = () => {
  formData.value = {
    title: '',
    author: '',
    description: '',
    genre: '',
    lang: '',
    page: '',
    picture: null,
    file: null
  };

  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => input.value = '');
};

const closePopup = () => {
  isClosing.value = true;
  setTimeout(() => {
    isClosing.value = false;
    resetForm();
    emit('close');
  }, 300);
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.visible) {
    closePopup();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown);
}
</script>

<template>
  <div 
    v-if="visible || isClosing" 
    :class="[
      'fixed inset-0 z-50 flex items-center justify-center p-4',
      'transition-all duration-300 ease-in-out',
      visible && !isClosing ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'
    ]"
    @click.self="closePopup"
  >
    <div 
      :class="[
        'bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl',
        'transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-hidden',
        'w-full max-w-4xl',
        visible && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      ]"
    >
      <!-- En-tête -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center">
            <Icon icon="mdi:book-plus" class="mr-3 text-orange-500" />
            Créer un nouveau livre
          </h2>
          <p class="text-gray-400 text-sm mt-1">Remplissez les informations de votre livre</p>
        </div>
        <button 
          @click="closePopup"
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <Icon icon="mdi:close" class="text-2xl text-gray-400 hover:text-white" />
        </button>
      </div>

      <!-- Contenu du formulaire -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="create" class="space-y-6">
          <!-- Upload de fichiers -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Photo de couverture -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-300">
                <Icon icon="mdi:image" class="inline mr-2" />
                Photo de couverture *
              </label>
              <div 
                @click="$refs.pictureInput.click()"
                class="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors duration-200"
              >
                <Icon icon="mdi:cloud-upload" class="text-4xl text-gray-500 mb-2 mx-auto" />
                <p class="text-gray-400 text-sm mb-2">
                  {{ formData.picture ? formData.picture.name : 'Cliquez pour télécharger' }}
                </p>
                <p class="text-gray-500 text-xs">PNG, JPG, WebP (max. 5MB)</p>
                <input 
                  ref="pictureInput"
                  type="file" 
                  @change="handleFileChange($event, 'picture')" 
                  class="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            <!-- Fichier numérique -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-300">
                <Icon icon="mdi:file-document" class="inline mr-2" />
                Fichier numérique *
              </label>
              <div 
                @click="$refs.fileInput.click()"
                class="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <Icon icon="mdi:file-upload" class="text-4xl text-gray-500 mb-2 mx-auto" />
                <p class="text-gray-400 text-sm mb-2">
                  {{ formData.file ? formData.file.name : 'Cliquez pour télécharger' }}
                </p>
                <p class="text-gray-500 text-xs">PDF, DOC, DOCX (max. 20MB)</p>
                <input 
                  ref="fileInput"
                  type="file" 
                  @change="handleFileChange($event, 'file')" 
                  class="hidden" 
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
          </div>

          <!-- Informations du livre -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Colonne gauche -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Titre *
                </label>
                <input 
                  v-model="formData.title"
                  type="text" 
                  placeholder="Titre du livre"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Auteur *
                </label>
                <input 
                  v-model="formData.author"
                  type="text" 
                  placeholder="Nom de l'auteur"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Langue *
                  </label>
                  <select 
                    v-model="formData.lang"
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  >
                    <option 
                      v-for="option in langOptions" 
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Pages *
                  </label>
                  <input 
                    v-model="formData.page"
                    type="number" 
                    placeholder="Nombre de pages"
                    min="1"
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            <!-- Colonne droite -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select 
                  v-model="formData.genre"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option 
                    v-for="option in genreOptions" 
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea 
                  v-model="formData.description"
                  placeholder="Description du livre..."
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 resize-vertical"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-700">
            <button 
              type="button"
              @click="closePopup"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Icon icon="mdi:close" class="mr-2" />
              Annuler
            </button>
            <button 
              type="submit"
              :disabled="isLoading"
              :class="[
                'px-6 py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center',
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-105'
              ]"
            >
              <Icon 
                :icon="isLoading ? 'mdi:loading' : 'mdi:book-plus'" 
                class="mr-2" 
                :class="{'animate-spin': isLoading}" 
              />
              {{ isLoading ? 'Création en cours...' : 'Créer le livre' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popups d'erreur et de succès -->
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
  </div>
</template>

<style scoped>
/* Styles personnalisés pour la scrollbar */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

.file-drop-zone {
  transition: all 0.3s ease;
}

.file-drop-zone.dragover {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}
</style>