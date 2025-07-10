export default [
  {
    path: '/forum',
    component: () => import('@/forum/presentation/layouts/ForumLayout.vue'),
    children: [
      {
        path: '',
        name: 'ForumHome',
        component: () => import('@/forum/presentation/pages/forum-home.page.vue'),
      },
      {
        path: 'post/:id',
        name: 'PostDetail',
        component: () => import('@/forum/presentation/pages/post-detail.page.vue'),
      },
    ],
  },
];
