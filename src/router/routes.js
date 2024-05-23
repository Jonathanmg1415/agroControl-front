const routes = [
  {
    path: "/main",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { auth: true },
      },
      {
        path: "egresos",
        component: () => import("src/pages/egresos/GestionEgresos.vue"),
        meta: { auth: true },
      },
      {
        path: "egresos/nuevo",
        component: () => import("src/pages/egresos/NuevoEgreso.vue"),
        meta: { auth: true },
      },
      {
        path: "graficas",
        component: () => import("src/pages/GraficasPage.vue"),
        meta: { auth: true },
      },
      {
        path: "ingresos",
        component: () => import("src/pages/ingresos/GestionIngresos.vue"),
        meta: { auth: true },
      },
      {
        path: "productos",
        component: () => import("src/pages/productos/GestionProductos.vue"),
        meta: { auth: true },
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
