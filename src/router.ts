import { createRouter, createWebHistory } from 'vue-router'

// Real routes are added in Step 6.
export default createRouter({
  history: createWebHistory(),
  routes: [
    // TODO(step-2): throwaway, remove before merge.
    { path: '/_kit', component: () => import('./views/KitView.vue') },
  ],
})
