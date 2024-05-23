<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div v-if="estaModoCrear">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="add_card" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de ingreso de egreso
          </div>
        </q-toolbar>
      </div>
      <div v-if="estaModoVista">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="credit_card" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de datos del egreso
          </div>
        </q-toolbar>
      </div>
      <div v-if="!estaModoCrear && !estaModoVista">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="credit_score" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de edición del egreso
          </div>
        </q-toolbar>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG">
          Datos generales del egreso
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            :readonly="estaModoVista"
            filled
            label="Ingrese la fecha del egreso"
            outlined
            v-model="fechaEgreso"
            mask="date"
            :rules="validacionFechaEgreso['date']"
          >
            <template v-slot:append>
              <q-icon name="event" color="primary" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="fechaEgreso"
                    minimal
                    :options="validacionFecha"
                    :locale="fechasEs"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-select
            :readonly="!estaModoCrear"
            filled
            v-model="nombre"
            label="Nombre del egreso*"
            :options="listaNombre"
            :rules="[
              (val) => (val != null && val !== '') || 'Seleccione el tipo de egreso',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="assignment_turned_in" size="1.2vmax" />
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-input
            :readonly="!estaModoCrear"
            filled
            v-model="descripcion"
            label="Descripción *"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Ingrese una descripción',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="description" size="1.2vmax" />
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG">
          Detalle del egreso
        </div>

        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pl-md">
          <div class="row items-center">
            <q-select
              filled
              v-model="productoSeleccionado"
              label="Productos"
              :options="productos"
              option-value="id"
              option-label="nombre"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.precio }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn
              color="primary"
              icon="add"
              @click="agregarProducto(productoSeleccionado)"
              class="q-ml-sm"
            />
          </div>
        </div>
      </div>

      <div class="q-mt-md">
        <q-table
          :rows="productosSeleccionados"
          :columns="columns"
          row-key="id"
          class="q-pa-sm"
        >
          <template v-slot:body-cell-precio="props">
            <q-td :props="props">
              {{ props.row.precio }}
            </q-td>
          </template>
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                color="negative"
                icon="delete"
                @click="eliminarProducto(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="text-right q-mt-md q-mr-md">
        <q-btn
          v-if="!estaModoVista"
          label="Guardar"
          type="submit"
          color="secondary"
        />
        <q-btn color="secondary" label="Cancelar" type="reset" class="q-ml-sm" />
        <div class="text-h6 q-mt-md">Total: {{ total }}</div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useEgresosStore } from "stores/egresos-store.js";
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, date } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const egresosStore = useEgresosStore();

const fechasEs = ref({
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
});

const fechaEgreso = ref(null);
const nombre = ref(null);
const descripcion = ref(null);
const productoSeleccionado = ref(null);
const productosSeleccionados = ref([]);

const listaNombre = ref([
  { value: 'Fumigación', label: 'FUMIGACIÓN' },
  { value: 'Abono', label: 'ABONO' },
  { value: 'Acarreo', label: 'ACARREO' },
  { value: 'Plantación', label: 'PLANTACIÓN' },
  { value: 'Mano_de_obra', label: 'TRABAJO' },
]);

const productos = ref([
  { id: 1, nombre: 'Producto 1', precio: 100 },
  { id: 2, nombre: 'Producto 2', precio: 200 },
  { id: 3, nombre: 'Producto 3', precio: 300 },
]);

const columns = [
  { name: 'nombre', label: 'Producto', field: 'nombre' },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

const props = defineProps({
  egreso: {
    type: Object,
    default() {},
  },
  estaModoCrear: {
    type: Boolean,
    default: false,
  },
  estaModoVista: {
    type: Boolean,
    default: false,
  },
});

const validacionFechaEgreso = {
  date: [(val) => validacionFecha(val) || val === null || 'La fecha del egreso es inválida'],
};

function validacionFecha(fechaDEgreso) {
  return fechaDEgreso <= today.value;
}

const dateNow = ref(Date.now());
const today = ref(date.formatDate(dateNow.value, 'YYYY/MM/DD'));

function agregarProducto(productoId) {
  const producto = productos.value.find((p) => p.id === productoId);
  if (producto && !productosSeleccionados.value.some((p) => p.id === producto.id)) {
    productosSeleccionados.value.push(producto);
    console.log('Producto agregado:', producto);
  } else {
    console.log('Producto no encontrado o ya seleccionado:', productoId);
  }
}

function eliminarProducto(producto) {
  const index = productosSeleccionados.value.findIndex((p) => p.id === producto.id);
  if (index !== -1) {
    productosSeleccionados.value.splice(index, 1);
  }
}

const total = computed(() => {
  return productosSeleccionados.value.reduce((sum, producto) => sum + producto.precio, 0);
});

async function onReset() {
  nombre.value = null;
  descripcion.value = null;
  fechaEgreso.value = null;
  productosSeleccionados.value = [];
  router.back();
}

async function actualizarEgreso() {
  const egreso = {
    id: props.egreso.id,
    fecha: new Date(fechaEgreso.value),
    nombre: nombre.value,
    descripcion: descripcion.value,
    productos: productosSeleccionados.value,
  };

  // Simulate API call
  console.log('Updating egreso:', egreso);
  router.push('/main/egresos');
}

async function agregarEgreso() {
  const egreso = {
    fecha: new Date(fechaEgreso.value),
    nombre: nombre.value,
    descripcion: descripcion.value,
    productos: productosSeleccionados.value,
  };

  // Simulate API call
  console.log('Adding egreso:', egreso);
  router.push('/main/egresos');
}

function onSubmit() {
  if (props.estaModoCrear) {
    agregarEgreso();
  } else {
    actualizarEgreso();
  }
}

onMounted(async() => {
  if (!props.estaModoCrear) {
    const egreso = props.egreso;
    nombre.value = egreso.nombre;
    descripcion.value = egreso.descripcion;
    fechaEgreso.value = egreso.fecha;
    productosSeleccionados.value = egreso.productos || [];
  } else {
    //await egresosStore.consultarParametros();
  }
});
</script>

<style lang="scss" scoped>
.fontG {
  font-size: 1vmax;
  font-family: 'graviola';
}
</style>
