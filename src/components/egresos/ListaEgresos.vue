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
        <q-td key="valortotal" :props="props" class="fontC">
          {{ fixedNumber(props.row.valortotal) }}
        </q-td>
        <q-td key="descripcion" :props="props">
          {{ props.row.descripcion }}
        </q-td>

        <q-td auto-width>
          <div class="row q-pr-md">
            <div class="col">
              <q-btn
                @click="verEgreso(JSON.stringify(props.row.id))"
                flat
                bordered
                class
                size="10px"
                round
                color="transparent"
                text-color="positive"
                icon="visibility"
              >
                <q-tooltip class="bg-grey-6">Ver detalles</q-tooltip>
              </q-btn>
            </div>
            <div class="col q-pl-md">
              <q-btn
                @click="editarEgreso(JSON.stringify(props.row.id))"
                flat
                bordered
                class
                size="10px"
                round
                color="transparent"
                text-color="blue"
                icon="edit"
              >
                <q-tooltip class="bg-grey-6">Editar egreso</q-tooltip>
              </q-btn>
            </div>
            <div class="col q-pl-md">
              <q-btn
                @click="eliminarEgreso(JSON.stringify(props.row.id))"
                flat
                bordered
                class
                size="10px"
                round
                color="red"
                text-color="red"
                icon="delete_forever"
              >
                <q-tooltip class="bg-grey-6">Eliminar egreso</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:top-right="props">
      <div class="row q-col-gutter-md">
        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
        </q-btn>

        <div>
          <q-btn
            @click="abrirCrearEgreso()"
            color="accent"
            label="Agregar egreso"
            text-color="white"
            icon="add_card"
            no-caps
          />
        </div>

        <div>
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
        </div>
      </div>
    </template>
    <template v-slot:top-left>
      <q-toolbar>
        <q-avatar square icon="receipt_long" font-size="30px">
          <!-- <img src="assets/" /> -->
        </q-avatar>

        <q-toolbar-title
          ><span class="text-weight-bold">Egresos</span></q-toolbar-title
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
import { useEgresosStore } from "stores/egresos-store.js";
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
    name: "valortotal",
    align: "center",
    label: "Valor_total",
    field: "valortotal",
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
const egresosStore = useEgresosStore();
const $q = useQuasar();
const row = ref();
const rows = computed({
  get() {
    return egresosStore.records.data;
  },
});

const rowsExport = computed({
  get() {
    return egresosStore.records.dataExportar;
  },
});

const localPagination = computed({
  get() {
    return egresosStore.pagination;
  },
});

const maxPage = computed(() =>
  Math.ceil(
    egresosStore.pagination.rowsNumber / egresosStore.pagination.rowsPerPage
  )
);

const currentPage = computed({
  get() {
    return +egresosStore.pagination.page;
  },
  async set(pageNumber) {
    egresosStore.pagination.page = pageNumber;
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
      message: "Cargando Egresos ...",
    });

    onInitialRequest({
      pagination: initialPagination.value,
      filter: undefined,
    });

    await egresosStore.cargarEgresos(true);
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

function abrirCrearEgreso() {
  router.push("/main/egresos/nuevo");
}

async function eliminarEgreso(idegreso) {
  try {
    $q.loading.show({
      message: "Eliminando ...",
    });
    await egresosStore.eliminarEgreso(idegreso);
    await egresosStore.cargarEgresos();
  } catch (error) {
    $q.notify({
      progress: true,
      message: "Ha ocurrido un error: " + error.message,
      color: "warning",
      icon: "warning",
      textColor: "white",
      multiLine: true,
    });
  } finally {
    $q.loading.hide();
  }
}

function editarEgreso(idegreso) {
  const encoded = window.btoa(idegreso);
  //router.push("/main/cliente/editar/" + encoded);
  $q.notify({
    progress: true,
    message: "Editar egreso esta en contrucción ",
    icon: "information",
    color: "white",
    textColor: "orange",
  });
}

function verEgreso(idegreso) {
  const encoded = window.btoa(idegreso);
  //router.push("/main/cliente/detallescliente/" + encoded);
  $q.notify({
    progress: true,
    message: "Ver detalles del egreso esta en contrucción ",
    icon: "information",
    color: "white",
    textColor: "orange",
  });
}

async function onInitialRequest() {
  if (rows.value.length === 0) {
    egresosStore.pagination = egresosStore.paginationOriginal;
  }
}

async function onRequest(pageNumber) {
  try {
    loading.value = true;

    $q.loading.show({
      message: "Cargando ...",
    });

    egresosStore.pagination.page = +pageNumber;
    await egresosStore.cargarEgresos();
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

  egresosStore.pagination.descending = descending;
  egresosStore.pagination.page = page;
  egresosStore.cargarEgresos();
  loading.value = false;

  $q.loading.hide();
}

function ordenarDatos() {
  // Ordeno los datos y filtro
  const datosExportar = rowsExport.value.map((row) => ({
    Fecha: row.fecha,
    Nombre: row.nombre,
    Total: row.valortotal,
    Descripcion: row.descripcion,
  }));
  return datosExportar;
}

async function exportarTablaXlsx() {
  try {
    $q.loading.show({
      message: "Cargando exportación ...",
    });

    await egresosStore.exportarEgresos(true);
    const datosExportar = ordenarDatos();

    // Creamos una hoja de cálculo con nuestros datos tipo JSON
    const worksheet = XLSX.utils.json_to_sheet(datosExportar);

    // Creamos nuestro libro de trabajo
    const workBook = XLSX.utils.book_new();

    // Agregamos nuestra hoja de cálculo a nuestor libro de trabajo (libro,hoja,nombrar hoja)
    XLSX.utils.book_append_sheet(workBook, worksheet, "Egresos");

    // Generó buffer, para que me ayude cuando tengo gran cantidad de datos
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    // Descargar el archivo
    XLSX.writeFile(workBook, "Egresos-" + formattedString + ".xlsx");
  } catch (error) {
    $q.notify({
      progress: true,
      message: "Error al momento de exportar los Egresos. " + error,
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
