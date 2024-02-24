import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";
import { useQuasar } from "quasar";
import { Cookies } from "quasar";
import { ref, computed } from "vue";

const VERIFICATION_ROUTE = process.env.VERIFICATION_ROUTE;
const LOGIN_ROUTE = process.env.LOGIN_ROUTE;
const FETCH_USER_ROUTE = process.env.FETCH_USER_ROUTE;

const $q = useQuasar();

export const useAuthStore = defineStore("autenticacion", () => {
  const ejecucionComputada = computed({
    get() {
      return ejecucion.value;
    },
  });
  const ejecucion = ref(null);
  const links = ref({ links1: {}, links2: {}, links3: {}, links4: {} });
  const id = ref(0);
  const email = ref("");
  const roles = ref("");
  const loginCallbacks = [];
  const superUserMode = ref(false);

  const check = (rolesAutorizados) => {
    if (roles.value) {
      if (typeof roles.value === "object") {
        roles.value = Object.values(roles.value);
      }

      if (Array.isArray(rolesAutorizados) && rolesAutorizados.length) {
        if (rolesAutorizados.includes(roles.value)) {
          return true;
        } else {
          return false;
        }
      } else if (rolesAutorizados) {
        if (roles.value.includes(rolesAutorizados)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return false;
  };

  const doLogin = async (data) => {
    const p = new Promise(function (resolve, reject) {
      return axiosInstance
        .post(LOGIN_ROUTE, data.body)
        .then((response) => {
          ejecucion.value = response.data.ejecucion;

          if (response.data.ejecucion.respuesta.estado === "OK") {
            email.value = ejecucionComputada.value.datos.user.data.email;
            roles.value = ejecucionComputada.value.datos.user.data.roles;
            id.value = ejecucionComputada.value.datos.user.data.id;
            links.value = ejecucionComputada.value.datos.links.data;

            setHeader({
              token: ejecucion.value.datos.token,
              rememberMe: false,
            });

            resolve();
          } else {
            email.value = "";
            roles.value = "";
            id.value = "";
            links.value = "";
            reject(new Error(response.data.ejecucion.respuesta.message));
          }
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
    return p;
  };

  const loggedIn = () => {
    return ejecucion.value !== null;
  };

  const setHeader = (data) => {
    axiosInstance.defaults.headers.common.Authorization =
      "Bearer " + data.token;
    if (data.rememberMe) {
      Cookies.set("authorization_token", data.token, {
        expires: 365,
      });
    } else {
      Cookies.set("authorization_token", data.token);
    }
  };

  const fetch = async () => {
    const token = Cookies.get("authorization_token");
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = "Bearer " + token;
    }

    if (axiosInstance.defaults.headers.common.Authorization) {
      return axiosInstance
        .get(FETCH_USER_ROUTE)
        .then((response) => {
          ejecucion.value = response.data.ejecucion;
          roles.value = ejecucionComputada.value.datos.user.data.roles;
          id.value = ejecucionComputada.value.datos.user.data.id;
          email.value = ejecucionComputada.value.datos.user.data.email;
          links.value = ejecucionComputada.value.datos.links.data;
        })
        .then(() => {
          loginCallback();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return new Promise((resolve, reject) => {
        reject("No authorization token found");
      });
    }
  };

  const logout = async () => {
    Cookies.remove("authorization_token");
    ejecucion.value = null;
    links.value = null;
  };

  const verify = (state, token) => {
    return axiosInstance.get(VERIFICATION_ROUTE + "?token=" + token);
  };

  const loginCallback = (data = {}) => {
    for (const loginCallback of loginCallbacks) {
      loginCallback({ router: data.router });
    }
  };

  return {
    ejecucion,
    links,
    id,
    email,
    roles,
    superUserMode,
    loginCallbacks,
    ejecucionComputada,
    loggedIn,
    check,
    doLogin,
    setHeader,
    fetch,
    logout,
    loginCallback,
    verify,
  };
});
