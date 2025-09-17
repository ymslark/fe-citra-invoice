// store/alert.js
import { defineStore } from 'pinia';


// const i18n = useI18n();
export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    message: '',
    type: 'success', // success, error, warning, info
  }),
  actions: {
    showAlertObject(alertObject) {
      this.message = alertObject.message
      this.type = alertObject.type
      this.show = true

      // Auto-close setelah 3 detik
      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
    
    showAlert(type, message) {
      this.message = message
      this.type = type
      this.show = true

      // Auto-close setelah 3 detik
      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
    hideAlert() {
      this.show = false;
    },
  },
});
