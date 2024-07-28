 /*It won't change the URL in the browser's address bar. It maintains navigation state internally within the application*/
// import { createMemoryHistory, createRouter } from 'vue-router'
// import UserLogin from '../components/UserLogin.vue';
// import HomePage from '../components/HomePage.vue';
// import SignUp from '../components/SignUp.vue';

// const routes = [
//   { path: '/', component: HomePage, name: 'home' },
//   { path: '/login', component: UserLogin, name: 'login', },
//   { path: '/register', component: SignUp, name: 'register', },
// ]

// const router = createRouter({
//   history: createMemoryHistory(),
//   routes,
// })

// export default router;

 /*This code allows you to reflect the current route and directly access the routes*/
import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/UserLogin.vue';
import HomePage from '../components/HomePage.vue';
import SignUp from '../components/SignUp.vue';

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/login', component: UserLogin, name: 'login', },
  { path: '/register', component: SignUp, name: 'register', },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;