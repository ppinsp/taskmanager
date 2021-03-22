export default {
  path: '/project',
  component: () => import('@/views/Project/index.vue'),
  children: [
    {
      path: '',
      name: 'ProjectList',
      component: () => import('@/views/Project/pages/ProjectList.vue'),
    },
    {
      path: 'create',
      name: 'CreateProject',
      component: () => import('@/views/Project/pages/CreateProject.vue'),
    },
    {
      path: ':id/detail',
      name: 'ProjectDetail',
      component: () => import('@/views/Project/pages/ProjectDetail.vue'),
    },
    {
      path: ':id/update',
      name: 'UpdateProject',
      component: () => import('@/views/Project/pages/CreateProject.vue'),
    }
  ]
}
