<template>
  <q-page class="row flex-center login">
    <div class="col-xl-5 col-lg-5 col-md-5 col-xs-12">
      <q-card flat>
        <q-card-section class="flex flex-center">
          <div class="col-xl-8 col-lg-8 col-md-10 col-xs-10">
            <div class="q-pb-md">
              <div class="warning" v-show="errorAutenticacion && mostrarAviso">
                <aviso-estado
                  :texto="mensaje"
                  :cancelar="true"
                  @ocultarAviso="editarAviso"
                  class="q-pb-md"
                />
              </div>
            </div>
            <div class="text-h6 text-grey-5">
              <span class="textoDegradado text-weight-bold row"
                >¡Bienvenido de nuevo!</span
              >
              inicio de sesion
            </div>
          </div>
        </q-card-section>
        <q-form @submit.prevent="onSubmit" ref="form">
          <div class="row justify-center">
            <div class="col-xl-6 col-lg-6 col-md-10 col-xs-10">
              <div class="text-secondary text-weight-bold q-pa-sm">Email</div>
              <q-input
                v-model="email"
                type="email"
                label="Email"
                :rules="validations['email']"
                lazy-rules
                autofocus
                outlined
                dense
              />
            </div>
          </div>

          <div class="row justify-center">
            <div class="col-xl-6 col-lg-6 col-md-10 col-xs-10">
              <div class="text-secondary text-weight-bold q-pa-sm">
                Password
              </div>
              <q-input
                v-model="password"
                outlined
                dense
                color="primary"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :rules="validations['password']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>
          </div>

          <q-card-section class="row justify-center">
            <div class="col-xl-6 col-lg-6 col-md-10 col-xs-10">
              <q-btn
                type="submit"
                class="full-width degradadoBoton"
                rounded
                text-color="white"
                label="Iniciar sesión"
              />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent, defineComponent } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const AvisoEstado = defineAsyncComponent(() =>
  import("../components/avisos/AvisoEstado.vue")
);

defineComponent({
  name: 'LoginPage'
})

const email = ref();
const password = ref();
const showPassword = ref(false);
const mensaje = ref("");
const mostrarAviso = ref(true);
const router = useRouter();
const $q = useQuasar();
const autenticacionStore = useAuthStore();
const form = ref("");
const errorAutenticacion = ref(false);
const loading = ref(false);

const validations = {
  email: [(val) => val !== "" || "Campo requerido"],
  password: [(val) => val !== "" || "Campo requerido"],
};

function editarAviso(estado) {
  mostrarAviso.value = estado;
}

const onSubmit = () => {
  loading.value = true;

  $q.loading.show({
    backgroundColor: "#fff",
    message: "Ingresando a la aplicación ...",
    messageColor: "white",
  });

  autenticacionStore
    .doLogin({
      body: {
        email: email.value,
        password: password.value,
      },
      rememberMe: false,
    })
    .then((response) => {
      if (autenticacionStore.ejecucion.respuesta.estado === "NOK") {
        mensaje.value = autenticacionStore.ejecucion.respuesta.message;
        errorAutenticacion.value = true;
        mostrarAviso.value = true;
      } else {
        email.value = null;
        form.value = null;
        password.value = null;
        router.push("/main");
      }
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 0) {
          mensaje.value =
            "En este momento no es posible conectarse con el servidor por favor comuniquese con el administrador";
          errorAutenticacion.value = true;
          mostrarAviso.value = true;
        }
      }
    })
    .finally(() => {
      $q.loading.hide();
      loading.value = false;
    });
};
</script>

<style>
.degradadoBoton {
  background: linear-gradient(
    100deg,
    rgba(98, 166, 255, 1) 19%,
    rgba(12, 99, 212, 1) 74%
  );
}
.textoDegradado {
  font-size: 2vmax;
  background: linear-gradient(
    100deg,
    rgba(98, 166, 255, 1) 19%,
    rgba(12, 99, 212, 1) 74%
  );
  -webkit-background-clip: text;
  color: transparent;
}
.warning {
  -webkit-box-shadow: -1px 14px 24px -5px rgba(57, 66, 196, 0.5);
  box-shadow: -1px 14px 24px -5px rgba(11, 19, 138, 0.2);
}
</style>
