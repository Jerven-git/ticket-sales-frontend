import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '@/store/authLogin';
import UserLogin from '@/components/UserLogin.vue';
import HomePage from '@/components/HomePage.vue';
import SignUp from '@/components/SignUp.vue';
import ProfileSettings from '@/components/ProfileSettings.vue';
import CreateEvent from '@/components/CreateEvent.vue';
import EventList from '@/components/EventList.vue';
import EventDetail from '@/components/EventDetail.vue';
import ManageEvents from '@/components/ManageEvents.vue';
import ManageOrganizers from '@/components/ManageOrganizers.vue';
import Checkout from '@/components/Checkout.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import OrderDetail from '@/components/OrderDetail.vue';
import Payment from '@/components/Payment.vue';

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/login', component: UserLogin, name: 'login' },
  { path: '/register', component: SignUp, name: 'register' },
  { path: '/events', component: EventList, name: 'events' },
  { path: '/events/:id', component: EventDetail, name: 'event-detail', props: true },

  {
    path: '/create-event',
    component: CreateEvent,
    name: 'create-event',
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: ProfileSettings,
    name: 'profile',
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-events',
    component: ManageEvents,
    name: 'manage-events',
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-organizers',
    component: ManageOrganizers,
    name: 'manage-organizers',
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout/:eventId',
    component: Checkout,
    name: 'checkout',
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    component: OrderHistory,
    name: 'orders',
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:orderNumber',
    component: OrderDetail,
    name: 'order-detail-view',
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/:orderNumber',
    component: Payment,
    name: 'payment',
    props: true,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      try {
        await authStore.checkAuth();
        if (!authStore.isLoggedIn) {
          next({ name: 'login' });
        } else {
          next();
        }
      } catch (error) {
        next({ name: 'login' });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
