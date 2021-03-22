export default {
  path: 'user',
  component: () => import('@/views/User/index.vue'),
  children: [
    {
      path: '',
      name: 'UserList',
      component: () => import('@/views/User/pages/UserList.vue'),
    },
    {
      path: 'create',
      name: 'CreateUser',
      component: () => import('@/views/User/pages/CreatAccount.vue'),
    },
    {
      path: ':id/update',
      name: 'UpdateUser',
      component: () => import('@/views/User/pages/CreatAccount.vue'),
    },
    {
      path: ':id/detail',
      name: 'UserDetail',
      component: () => import('@/views/User/pages/UserDetail.vue'),
    },
    {
      path: ':id/my-account',
      name: 'UserMyAccount',
      component: () => import('@/views/User/pages/UpdateMyAccount.vue'),
    },
  ]
}
