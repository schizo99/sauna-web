import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../home/HomePage.vue';
import TempGraph from '../graph/TempGraph.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: HomePage,
  }, {
    path: '/graph',
    name: 'Graph',
    component: TempGraph,
  }],
});
