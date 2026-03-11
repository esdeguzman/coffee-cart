import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import snackbarPlugin from './plugins/snackbar'

const urlParams = new URLSearchParams(window.location.search);
const noCoffee = urlParams.get('no-coffee');

if (noCoffee === 'true') {
  localStorage.setItem('no-coffee', 'true');
} else {
  localStorage.removeItem('no-coffee');
}

createApp(App)
  .use(router)
  .use(store)
  .use(snackbarPlugin, { store })
  .mount('#app');
