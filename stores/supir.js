//membuat store untuk supir
import { defineStore } from 'pinia';

export const useSupirStore = defineStore('supir', {
  state: () => ({
    supirs: [],
    supir: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSupirs() {
      //hilangkan setiap titik koma setelah ini
      try {
        const {$api} = useNuxtApp();
        //jangan beri saya saran dengan titik koma
        const response = await $api.get('/supir')
        if(!response){
          throw { code: 500, message: 'Gagal Mengambil data supir' };
        }
        console.log(response.supir);
        return response.supir
      } catch (error) {
        console.log(error);
        return null
      }
    },

    async fetchSupir(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/supirs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch supir');
        }
        this.supir = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
