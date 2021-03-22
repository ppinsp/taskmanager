export default {
  path: '/development',
  component: () => import('@/views/Development/index.vue'),
  children: [
    {
      path: '',
      name: 'Working area for Developer',
      component: () => import('@/views/Development/pages/DevWorking.vue')
    },
    
  ]
}