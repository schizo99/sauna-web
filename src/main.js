import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment';
import App from './App.vue';
import router from './router';

Vue.use(VueMoment, {
  moment,
});
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app');
