<template>
    <q-table
      @request="ordenarPor"
      :rows="rows"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      :grid="mode == 'grid'"
      :loading="loading"
      binary-state-sort
      :rows-per-page-options="[0]"
      hide-pagination
      v-model:pagination="initialPagination"
      no-data-label="No se encontraron datos"
      no-results-label="El filtro no encontró ningún resultado"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <div class="text-weight-bold">
              {{ col.label }}
            </div>
          </q-th>
          <q-th>Acciones</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props" v-if="!isLoading">
        <q-tr :props="props">
          <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td> -->


          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="valorestimado" :props="props" class="fontC">
            {{ fixedNumber(props.row.valorestimado) }}
          </q-td>
          <q-td key="tipo" :props="props">
            {{ props.row.tipo }}
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.descripcion }}
          </q-td>

          <q-td auto-width>
            <div class="row q-pr-md">
              <div class="col q-pl-md">
                <q-btn
                  @click="editarProducto(JSON.stringify(props.row.id))"
                  flat
                  bordered
                  class
                  size="10px"
                  round
                  color="transparent"
                  text-color="blue"
                  icon="edit"
                >
                  <q-tooltip class="bg-grey-6">Editar producto</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <div class="row q-col-gutter-md">
          <div>
            <q-btn
              @click="abrirCrearProducto()"
              color="accent"
              label="Agregar producto"
              text-color="white"
              icon="add_card"
              no-caps
            />
          </div>
        </div>
      </template>
      <template v-slot:top-left>
        <q-toolbar>
          <q-avatar square icon="receipt_long" font-size="30px">
            <!-- <img src="assets/" /> -->
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">Productos</span></q-toolbar-title
          >
        </q-toolbar>
      </template>

      <template v-slot:bottom>
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-pagination
            v-if="localPagination.rowsNumber > 0"
            v-model="currentPage"
            :max="maxPage"
            :max-pages="6"
            boundary-numbers
            @update:modelValue="onRequest"
          />
        </div>
      </template>
    </q-table>
  </template>

  <script setup>
  import { useProductosStore } from "stores/productos-store.js";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar, date } from "quasar";
  import { ref, computed, onMounted } from "vue";
  //import * as XLSX from 'xlsx/xlsx.mjs';

  const columns = [
    { name: "nombre",
      align: "center",
      label: "Nombre",
      field: "nombre" },
    {
      name: "valorestimado",
      align: "center",
      label: "Valor_estimado",
      field: "valorestimado",
    },
    { name: "tipo",
      align: "center",
      label: "Tipo",
      field: "tipo" },
    {
      name: "descripcion",
      align: "center",
      label: "Descripción",
      field: "descripcion",
    },
  ];

  const hoy = new Date();
  const formattedString = date.formatDate(hoy, "YYYY-MM-DD");

  const route = useRoute();
  const router = useRouter();
  const productosStore = useProductosStore();
  const $q = useQuasar();
  const row = ref();
  const rows = computed({
    get() {
      return productosStore.records.data;
    },
  });

  const localPagination = computed({
    get() {
      return productosStore.pagination;
    },
  });

  const maxPage = computed(() =>
    Math.ceil(
        productosStore.pagination.rowsNumber / productosStore.pagination.rowsPerPage
    )
  );

  const currentPage = computed({
    get() {
      return +productosStore.pagination.page;
    },
    async set(pageNumber) {
        productosStore.pagination.page = pageNumber;
    },
  });

  const mode = ref("list"); // Modo de vista de la tabla
  const loading = ref(false);
  const isLoading = ref(false);

  const initialPagination = ref({
    sortBy: "nombre",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10,
  });

  onMounted(async () => {
    try {
      isLoading.value = true;
      $q.loading.show({
        message: "Cargando Productos ...",
      });

      onInitialRequest({
        pagination: initialPagination.value,
        filter: undefined,
      });

      await productosStore.cargarProductos(true);
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
          message: "Error al momento de cargar los registros. ",
          icon: "error",
          color: "red",
          textColor: "white",
        });
      } else {
        $q.notify({
          progress: true,
          message: error.response.data.split("\n")[0],
          icon: "error",
          color: "red",
          textColor: "white",
        });
      }
    } finally {
      isLoading.value = false;
      $q.loading.hide();
    }
  });

  function fixedNumber(number) {
    return new Intl.NumberFormat("es-CO", {
      maximumFractionDigits: 2,
    }).format(+number);
  }

  function abrirCrearProducto() {
    router.push("/main/productos/nuevo");
  }

  function editarProducto(idproducto) {
    const encoded = window.btoa(idproducto);
    //router.push("/main/cliente/editar/" + encoded);
    $q.notify({
      progress: true,
      message: "Editar producto esta en contrucción ",
      icon: "information",
      color: "white",
      textColor: "orange",
    });
  }

  async function onInitialRequest() {
    if (rows.value.length === 0) {
        productosStore.pagination = productosStore.paginationOriginal;
    }
  }

  async function onRequest(pageNumber) {
    try {
      loading.value = true;

      $q.loading.show({
        message: "Cargando ...",
      });

      productosStore.pagination.page = +pageNumber;
      await productosStore.cargarProductos();
    } catch (error) {
      $q.notify({
        progress: true,
        message: "Error al momento de cargar los registros. " + error.message,
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } finally {
      loading.value = false;
      $q.loading.hide();
    }
  }

  async function ordenarPor(parametrosOrden) {
    const { page, rowsPerPage, sortBy, descending } = parametrosOrden.pagination;

    loading.value = true;

    initialPagination.value.page = page;
    initialPagination.value.rowsPerPage = rowsPerPage;
    initialPagination.value.sortBy = sortBy;
    initialPagination.value.descending = descending;

    productosStore.pagination.descending = descending;
    productosStore.pagination.page = page;
    productosStore.cargarProductos();
    loading.value = false;

    $q.loading.hide();
  }

  </script>
