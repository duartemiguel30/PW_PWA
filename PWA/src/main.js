import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTachometerAlt, faUsers, faCogs, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// Adicionar os ícones à biblioteca
library.add(faTachometerAlt, faUsers, faCogs, faChartLine);

const app = createApp(App);
app.use(router);
app.mount('#app');
