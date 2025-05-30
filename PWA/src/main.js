import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTachometerAlt, faUsers, faCogs, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faTachometerAlt, faUsers, faCogs, faChartLine);

const app = createApp(App);
app.use(router);
app.mount('#app');

// ✅ Registar o service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registado com sucesso:', registration);
      })
      .catch(error => {
        console.error('❌ Falha ao registar Service Worker:', error);
      });
  });
}
