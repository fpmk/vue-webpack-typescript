import * as Vue from 'vue';
import VueRouter from 'vue-router';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import axios from 'axios';
import VueAxios from 'vue-axios';

import { UsersTableComponent } from './components/users-table';
import { UserProfileComponent } from './components/user-profile';

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(VueRx, Rx);

let router = new VueRouter({
  routes: [
    { path: '/', component: UsersTableComponent }
  ]
});

new Vue({
  el: '#app-main',
  router: router,
  components: {
    'users-table': UsersTableComponent
  }
});
