<template>
  <q-page padding>
    <q-card>
      <q-card-section v-if="productoEditar.hasOwnProperty('id')">
            <actualizar-producto
              :producto="productoEditar"
              :estaModoCrear="false"
              :estaModoVista="false"
            />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { defineAsyncComponent } from "vue";
import { useProductosStore } from "stores/productos-store.js";

const ActualizarProducto = defineAsyncComponent(() =>
  import("src/components/productos/ActualizarProducto.vue")
);

const route = useRoute();
const $q = useQuasar();
const idProducto = ref();
const productosStore = useProductosStore();
const productoEditar = ref({});

onMounted(async () => {
  idProducto.value = window.atob(route.params.producto);
  idProducto.value = +idProducto.value;


  try {
    $q.loading.show({
      backgroundColor: "#fff",
      message: "Cargando información del producto...",
      messageColor: "white",
    });

    productoEditar.value = await productosStore.consultarProducto(idProducto.value);

  } catch (error) {
    if (error.message.includes("Network Error")) {
      $q.notify({
        progress: true,
        message:
          "Error de conexión con el servidor. Por favor, revisa tu conexión a internet.",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else if (!error.response) {
      $q.notify({
        progress: true,
        message: "Error al cargar los datos del producto.",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else {
      $q.notify({
        progress: true,
        message: error.response.data.split("\n")[0],
        icon: "warning",
        color: "red",
        textColor: "white",
      });
    }
  } finally {
    $q.loading.hide();
  }
});
</script>
