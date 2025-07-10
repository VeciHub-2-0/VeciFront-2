// Archivo de configuración de rutas del foro

// Importar componentes
const ForumHomePage = () => import('../presentation/pages/forum-home.page.vue');
const PostDetailPage = () => import('../presentation/pages/post-detail.page.vue');
const CreatePostPage = () => import('../presentation/pages/create-post.page.vue');
const EditPostPage = () => import('../presentation/pages/edit-post.page.vue');

// Definir rutas del foro
const forumRoutes = [
  {
    path: '/forum',
    name: 'forum',
    component: ForumHomePage,
    meta: { title: 'Foro', requiresAuth: true }
  },
  {
    path: '/forum/post/:id',
    name: 'post-detail',
    component: PostDetailPage,
    props: true,
    meta: { title: 'Detalle del Post', requiresAuth: true }
  },
  {
    path: '/forum/new',
    name: 'create-post',
    component: CreatePostPage,
    meta: { title: 'Crear Post', requiresAuth: true }
  },
  {
    path: '/forum/edit/:id',
    name: 'edit-post',
    component: EditPostPage,
    props: true,
    meta: { title: 'Editar Post', requiresAuth: true }
  }
];

export default forumRoutes;
