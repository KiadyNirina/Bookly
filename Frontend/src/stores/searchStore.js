import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    previousPath: ''
  })
});