export default {
  path: '/team',
  component: () => import('@/views/Team/index.vue'),
  children: [
    {
      path: '/',
      name: 'TeamList',
      component: () => import('@/views/Team/pages/TeamList.vue'),
    },
    {
      path: 'create',
      name: 'CreateTeam',
      component: () => import('@/views/Team/pages/CreateTeam.vue'),
    },
    {
      path: ':id/update',
      name: 'UpdateTeam',
      component: () => import('@/views/Team/pages/CreateTeam.vue'),
    },
    {
      path: ':id/detail',
      name: 'TeamDetail',
      component: () => import('@/views/Team/pages/TeamDetail.vue'),
    },

  ]
}
