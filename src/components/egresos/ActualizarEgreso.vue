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
        <div
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG"
        >
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
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
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
              (val) =>
                (val != null && val !== '') || 'Seleccione el tipo de egreso',
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

        <div
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG"
        >
          Detalle del egreso
        </div>

        <!-- <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
          <q-input
            :readonly="estaModoVista"
            filled
            maxlength="45"
            v-model="primerNombre"
            label="Primer nombre *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Ingrese el primer nombre',
              (val) =>
                /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/.test(val) ||
                'Sólo se permiten letras',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="badge" size="1.2vmax" />
              </div>
            </template>
          </q-input>
        </div> -->

      </div>

      <div class="row justify-center">
        <q-btn
          v-if="!estaModoVista"
          label="Guardar"
          type="submit"
          color="secondary"
        />
        <q-btn
          color="secondary"
          label="Cancelar"
          type="reset"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { useQuasar, date } from 'quasar';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEgresosStore } from 'stores/egresos-store.js';

const router = useRouter();
const $q = useQuasar();

const fechasEs = ref({
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  days: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ],
});

const fechaEgreso = ref(null);
const nombre = ref(null);
const descripcion = ref(null);

const egresosStore = useEgresosStore();
const egresoAuxiliar = ref({});
const dateNow = ref(Date.now());
const today = ref(date.formatDate(dateNow.value, 'YYYY/MM/DD'));

const listaNombre = ref([
  { value: 'Fumigación', label: 'FUMIGACIÓN' },
  { value: 'Abono', label: 'ABONO' },
  { value: 'Acarreo', label: 'ACARREO' },
  { value: 'Plantación', label: 'PLANTACIÓN' },
  { value: 'Mano_de_obra', label: 'TRABAJO' },
]);

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
  date: [
    (val) =>
      validacionFecha(val) ||
      val === null ||
      'La fecha del egreso es inválida',
  ],
};

function validacionFecha(fechaDEgreso) {
  return fechaDEgreso <= today.value;
}

/* const validarCampoVacio = {
  val: [(val) => validarVacio(val) || 'Sólo se permiten letras'],
};

function validarVacio(valorAEvaluar) {
  if (valorAEvaluar !== '') {
    return /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/.test(valorAEvaluar);
  }
  if (valorAEvaluar === '') {
    return true;
  }
} */

async function onReset() {
  nombre.value = null;
  descripcion.value = null;
  fechaEgreso.value = null;

  router.back();
}

async function actualizarEgreso() {
  let tipoId = '';
  listaNombre.value.forEach((element) => {
    if (element.label === nombre.value) {
      tipoId = element.value;
    }
  });

  const egreso = {
    id: props.egreso.id,
    fecha: new Date(fechaEgreso.value),
    nombre: tipoId,
    descripcion: descripcion.value,
  };

  if (JSON.stringify(egresoAuxiliar.value) === JSON.stringify(egreso)) {
    $q.notify({
      progress: true,
      message: 'Sin cambios en el los datos del egreso. ',
      icon: 'warning',
      color: 'secondary',
      textColor: 'white',
    });
    router.push('/main/egresos');
    return;
  }

  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Actualizando Egreso...',
      messageColor: 'white',
    });

    //await egresosStore.actualizarEgreso(egreso);

    $q.notify({
      progress: true,
      message: 'El egreso se actualizo satisfactoriamente. ',
      icon: 'save',
      color: 'white',
      textColor: 'primary',
    });
    router.push('/main/egresos');
  } catch (error) {
    if (error.message.includes('Network Error')) {
      $q.notify({
        progress: true,
        message:
          'Error de conexión con el servidor. Por favor, revisa tu conexión a internet.',
        icon: 'error',
        color: 'red',
        textColor: 'white',
      });
    } else if (!error.response) {
      $q.notify({
        progress: true,
        message: 'Error al momento de cargar los registros. ',
        icon: 'error',
        color: 'red',
        textColor: 'white',
      });
    } else {
      $q.notify({
        progress: true,
        message: error.response.data.split('\n')[0],
        icon: 'warning',
        color: 'red',
        textColor: 'white',
      });
    }
  } finally {
    $q.loading.hide();
  }
}

async function agregarEgreso() {
  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Guardando egreso...',
      messageColor: 'white',
    });
    if (
      nombre.value !== null &&
      descripcion.value !== null &&
      fecha.value !== null
    ) {
      if (nombre.value !== null) {
        nombre.value = nombre.value.label;
      }

      const egreso = {
        fecha: new Date(fechaEgreso.value),
        nombre: nombre.value.value,
        descripcion: descripcion.value,
      };

      //await egresosStore.agregarEgreso(egreso);

      $q.notify({
        progress: true,
        message: 'El egreso se agrego satisfactoriamente. ',
        icon: 'save',
        color: 'white',
        textColor: 'primary',
      });

      router.back();
    } else {
      $q.notify({
        progress: true,
        message: 'Error en los datos del egreso. ',
        icon: 'warning',
        color: 'secondary',
        textColor: 'white',
      });
    }
  } catch (error) {
    if (error.message.includes('Network Error')) {
      $q.notify({
        progress: true,
        message:
          'Error de conexión con el servidor. Por favor, revisa tu conexión a internet.',
        icon: 'error',
        color: 'red',
        textColor: 'white',
      });
    } else if (!error.response) {
      $q.notify({
        progress: true,
        message: 'Error al momento de cargar los registros. ',
        icon: 'error',
        color: 'red',
        textColor: 'white',
      });
    } else {
      $q.notify({
        progress: true,
        message: error.response.data.split('\n')[0],
        icon: 'warning',
        color: 'red',
        textColor: 'white',
      });
    }
  } finally {
    $q.loading.hide();
  }
}

function onSubmit() {
  if (props.estaModoCrear) {
    agregarEgreso();
  } else {
    actualizarEgreso();
  }
}

onMounted(async () => {
  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Precargando datos...',
      messageColor: 'white',
    });

    if (!props.estaModoCrear) {
      const egreso = props.egreso;
      egresoAuxiliar.value = props.egreso;
      let tipoId = '';
      listaNombre.value.forEach((element) => {
        if (element.value === egreso.nombre) {
          tipoId = element.label;
        }
      });
      nombre.value = tipoId;
      descripcion.value = egreso.descripcion;
      fechaEgreso.value = egreso.fecha;
    }

  } catch (error) {
    $q.notify({
      progress: true,
      message: 'Error en la precarga de los datos',
      icon: 'error',
      color: 'red',
      textColor: 'white',
    });
  } finally {
    $q.loading.hide();
  }
});

</script>

<style lang="scss" scoped>
.fontG {
  font-size: 1vmax;
  font-family: 'graviola';
}
</style>
