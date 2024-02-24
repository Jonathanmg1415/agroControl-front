/* eslint-disable */
import { boot } from "quasar/wrappers";
import { useAuthStore } from "../stores/auth-store";
import { createPinia } from "pinia";

function isArrayOrString(variable) {
  if (typeof variable === typeof [] || typeof variable === typeof "") {
    return true;
  }
  return false;
}

export default boot(({ app, router, store, Vue }) => {
  app.use(createPinia());

  const autenticacionStore = useAuthStore(store);

  router.beforeEach((to, from, next) => {
    const record = to.matched.find((record) => record.meta.auth);
    if (record) {
      // Control si existe el meta
      //'Existe el meta en el registro'
      if (!autenticacionStore.loggedIn()) {
        // No loggedIn
        return autenticacionStore
          .fetch()
          .then((data) => {
            if (!autenticacionStore.loggedIn()) {
              next("/"); // Lo redirecciona a raiz por no poder loggedIn
            } else if (
              isArrayOrString(record.meta.auth) &&
              !autenticacionStore.check(record.meta.auth)
            ) {
              next("/main");
            } else {
              next();
            }
          })
          .catch((err) => {
            next("/");
          });
      } else {
        // Esta loggedIn, validación de si meta es arreglo o string
        if (
          isArrayOrString(record.meta.auth) &&
          !autenticacionStore.check(record.meta.auth)
        ) {
          // No cuenta con los permisos necesarios para la opción
          next("/main/nopermisos");
        } else {
          next();
        }
      }
    } else {
      // No existe el meta, continua
      next();
    }
  });

  /**
   * Set authentication routes
   */
  let { routes } = router.options;
  let routeData = routes.find((r) => r.path === "/");
  const currentRoutes = routeData.children.map((route) => route.path);

  app.mounted = () => {
    autenticacionStore.fetch().catch((err) => {
      autenticacionStore.logout;
    });
  };

  var helper = {};
  helper.login = async (data) => {
    return autenticacionStore.doLogin(data);
  };
  helper.logout = () => {
    return autenticacionStore.logout();
  };
  helper.verify = (token) => {
    return autenticacionStore.verify(token);
  };
  helper.loggedIn = () => {
    return autenticacionStore.loggedIn;
  };
  helper.check = (roles) => {
    autenticacionStore.check(roles);
  };
  helper.setHeader = (data) => {
    return autenticacionStore.setHeader(data);
  };
  helper.fetch = () => {
    return autenticacionStore.fetch();
  };
  app.config.globalProperties.$auth = helper;

  autenticacionStore.loginCallbacks = console.log("Logged in");
});
