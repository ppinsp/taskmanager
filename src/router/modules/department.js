export default {
  path: '/department',
  component: () => import('@/views/Department/index.vue'),
  children: [
    {
      path: '/',
      name: 'DepartmentList',
      component: () => import('@/views/Department/pages/DepartmentList.vue'),
    },
    {
      path: 'create',
      name: 'CreateDepartment',
      component: () => import('@/views/Department/pages/CreateDepartment.vue'),
    },
    {
      path: ':id/update',
      name: 'UpdateDepartment',
      component: () => import('@/views/Department/pages/CreateDepartment.vue'),
    },
    {
      path: ':id/detail',
      name: 'DepartmentDetail',
      component: () => import('@/views/Department/pages/DepartmentDetail.vue'),
    }
  ]
}
