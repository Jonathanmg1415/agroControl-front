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

        <q-td key="fecha" :props="props">
          {{ props.row.fecha }}
        </q-td>
        <q-td key="nombre" :props="props">
          {{ props.row.nombre }}
        </q-td>
        <q-td key="valor" :props="props" class="fontC">
          {{ fixedNumber(props.row.valor) }}
        </q-td>
        <q-td key="descripcion" :props="props">
          {{ props.row.descripcion }}
        </q-td>

        <q-td auto-width>
          <div class="row q-pr-md">
            <div class="col q-pl-md">
              <q-btn
                @click="editarIngreso(JSON.stringify(props.row.id))"
                flat
                bordered
                class
                size="10px"
                round
                color="transparent"
                text-color="blue"
                icon="edit"
              >
                <q-tooltip class="bg-grey-6">Editar Ingreso</q-tooltip>
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
            @click="abrirCrearIngreso()"
            color="accent"
            label="Agregar Ingreso"
            text-color="white"
            icon="add_card"
            no-caps
          />
        </div>

        <!-- <div>
          <q-btn
            color="accent"
            icon-right="archive"
            label="Exportar egresos"
            no-caps
          />
          <q-menu>
            <q-list dense style="min-width: 185px">
              <q-item clickable v-close-popup @click="exportarTablaXlsx()">
                <q-item-section>XLSX</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div> -->
      </div>
    </template>
    <template v-slot:top-left>
      <q-toolbar>
        <q-avatar square icon="attach_money" font-size="30px">
          <!-- <img src="assets/" /> -->
        </q-avatar>

        <q-toolbar-title
          ><span class="text-weight-bold">Ingresos</span></q-toolbar-title
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
import { useIngresosStore } from "stores/ingresos-store.js";
import { useRoute, useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import { ref, computed, onMounted } from "vue";
import * as XLSX from "xlsx/xlsx.mjs";

const columns = [
  {
    name: "fecha",
    required: true,
    label: "Fecha",
    align: "center",
    field: "fecha",
  },
  { name: "nombre", align: "center", label: "Nombre", field: "nombre" },
  {
    name: "valor",
    align: "center",
    label: "Valor",
    field: "valor",
  },
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
const ingresosStore = useIngresosStore();
const $q = useQuasar();
const row = ref();
const rows = computed({
  get() {
    return ingresosStore.records.data;
  },
});

const rowsExport = computed({
  get() {
    return ingresosStore.records.dataExportar;
  },
});

const localPagination = computed({
  get() {
    return ingresosStore.pagination;
  },
});

const maxPage = computed(() =>
  Math.ceil(
    ingresosStore.pagination.rowsNumber / ingresosStore.pagination.rowsPerPage
  )
);

const currentPage = computed({
  get() {
    return +ingresosStore.pagination.page;
  },
  async set(pageNumber) {
    ingresosStore.pagination.page = pageNumber;
  },
});

const mode = ref("list"); // Modo de vista de la tabla
const loading = ref(false);
const isLoading = ref(false);

const initialPagination = ref({
  sortBy: "fecha",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

onMounted(async () => {
  try {
    isLoading.value = true;
    $q.loading.show({
      message: "Cargando Ingresos ...",
    });

    onInitialRequest({
      pagination: initialPagination.value,
      filter: undefined,
    });

    await ingresosStore.cargarIngresos(true);
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

function abrirCrearIngreso() {
  //router.push("/main/cliente/nuevo");
  $q.notify({
    progress: true,
    message: "Agregar ingreso esta en contrucción ",
    icon: "information",
    color: "white",
    textColor: "orange",
  });
}

function editarIngreso(idingreso) {
  const encoded = window.btoa(idingreso);
  //router.push("/main/cliente/editar/" + encoded);
  $q.notify({
    progress: true,
    message: "Editar ingreso esta en contrucción ",
    icon: "information",
    color: "white",
    textColor: "orange",
  });
}

async function onInitialRequest() {
  if (rows.value.length === 0) {
    ingresosStore.pagination = ingresosStore.paginationOriginal;
  }
}

async function onRequest(pageNumber) {
  try {
    loading.value = true;

    $q.loading.show({
      message: "Cargando ...",
    });

    ingresosStore.pagination.page = +pageNumber;
    await ingresosStore.cargarIngresos();
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

  ingresosStore.pagination.descending = descending;
  ingresosStore.pagination.page = page;
  ingresosStore.cargarIngresos();
  loading.value = false;

  $q.loading.hide();
}

function ordenarDatos() {
  // Ordeno los datos y filtro
  const datosExportar = rowsExport.value.map((row) => ({
    Fecha: row.fecha,
    Nombre: row.nombre,
    Total: row.valor,
    Descripcion: row.descripcion,
  }));
  return datosExportar;
}

async function exportarTablaXlsx() {
  try {
    $q.loading.show({
      message: "Cargando exportación ...",
    });

    // await ingresosStore.exportarEgresos(true);
    const datosExportar = ordenarDatos();

    // Creamos una hoja de cálculo con nuestros datos tipo JSON
    const worksheet = XLSX.utils.json_to_sheet(datosExportar);

    // Creamos nuestro libro de trabajo
    const workBook = XLSX.utils.book_new();

    // Agregamos nuestra hoja de cálculo a nuestor libro de trabajo (libro,hoja,nombrar hoja)
    XLSX.utils.book_append_sheet(workBook, worksheet, "Ingresos");

    // Generó buffer, para que me ayude cuando tengo gran cantidad de datos
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    // Descargar el archivo
    XLSX.writeFile(workBook, "Ingresos-" + formattedString + ".xlsx");
  } catch (error) {
    $q.notify({
      progress: true,
      message: "Error al momento de exportar los Ingresos. " + error,
      icon: "warning",
      color: "secondary",
      textColor: "white",
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

<style lang="sass" scoped>
.bg
  background-color: transparent
</style>
