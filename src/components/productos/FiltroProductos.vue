<template>
  <q-card flat>
    <q-card-section>
      <div style="width: 100%" class="bg-transparent">
        <q-form
          class="row q-col-gutter-sm"
          @submit.prevent="actualizarTabla"
          @reset="limpiarFiltro"
        >
          <!-- parametro del producto -->

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              filled
              v-model="productoBusqueda"
              label="Nombre del producto"
            />
          </div>

          <!-- parametro del producto -->

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              filled
              v-model="tipoProductoBusqueda"
              label="Tipo del producto"
            />
          </div>

          <div>
            <q-btn
              label="Buscar"
              icon="search"
              type="submit"
              color="accent"
            />
          </div>
          <div>
            <q-btn
              label="Limpiar"
              icon="cancel"
              type="reset"
              color="accent"
            />
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar, date } from "quasar";
import { useProductosStore } from "stores/productos-store.js";

const $q = useQuasar();
const productosStore = useProductosStore();

const productoBusqueda = ref("");
const tipoProductoBusqueda = ref("");

async function actualizarTabla() {
  try {
    $q.loading.show({
      message: "Cargando productos...",
    });

    const filtroBusqueda = {
      productoBusqueda: productoBusqueda.value,
      tipoProductoBusqueda: tipoProductoBusqueda.value,
    };

    productosStore.filter = filtroBusqueda;
    productosStore.pagination = productosStore.paginationOriginal;
    await productosStore.cargarProductos(true);
  } catch (error) {
    $q.notify({
      progress: true,
      message: "Error al momento de cargar la tabla. ",
      icon: "danger",
      color: "white",
      textColor: "red",
    });
  } finally {
    $q.loading.hide();
  }
}

function limpiarFiltro() {
  productoBusqueda.value = "";
  tipoProductoBusqueda.value = "";
}
</script>
