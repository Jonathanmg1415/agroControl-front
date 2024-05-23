<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div v-if="estaModoCrear">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="post_add" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de ingreso de productos
          </div>
        </q-toolbar>
      </div>
      <div v-if="estaModoVista">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="badge" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de datos del producto
          </div>
        </q-toolbar>
      </div>
      <div v-if="!estaModoCrear && !estaModoVista">
        <q-toolbar class="bg-grey-5">
          <q-avatar round color="white">
            <q-icon name="manage_accounts" />
          </q-avatar>
          <div class="text-weight-medium q-pl-sm fontG text-h6">
            Formulario de edición de productos
          </div>
        </q-toolbar>
      </div>
      <div class="row q-col-gutter-sm">
        <div
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG"
        >
          Datos del producto
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            :readonly="estaModoVista"
            filled
            maxlength="45"
            v-model="nombre"
            label="Nombre *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Ingrese el nombre',
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
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-select
            :readonly="estaModoVista"
            filled
            v-model="tipo"
            label="Tipo *"
            :options="listaOpciones"
            :rules="[
              (val) =>
                (val != null && val !== '') || 'Seleccione el tipo',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="assignment_turned_in" size="1.2vmax" />
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            :readonly="estaModoVista"
            filled
            maxlength="15"
            v-model="valorestimado"
            label="Valor estimado *"
            lazy-rules
            :rules="[
              (val) =>
                /^[0-9-]+$/.test(val) ||
                val === null ||
                'Sólo se permiten números',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="attach_money" size="1.2vmax" />
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            :readonly="estaModoVista"
            filled
            v-model="descripcion"
            label="Descripción *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Ingrese la descripción',
            ]"
          >
            <template v-slot: append>
              <div class="flex flex-center">
                <q-icon name="badge" size="1.2vmax" />
              </div>
            </template>
          </q-input>
        </div>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductosStore } from 'stores/productos-store';

const $q = useQuasar();
const router = useRouter();
const productosStore = useProductosStore();

const nombre = ref(null);
const tipo = ref(null);
const valorestimado = ref(0);
const descripcion = ref('');
const productoAuxiliar = ref({});

const listaOpciones = ref([
  { label: 'QUIMICO', value: "QUIMICO" },
  { label: 'ABONO', value: "ABONO" },
  { label: 'ACARREO', value: 'ACARREO' },
  { label: 'MANO_OBRA', value: 'MANO_OBRA' },
  { label: 'PLANTAR', value: 'PLANTAR' },
]);

const props = defineProps({
  producto: {
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

async function onSubmit() {
  if (props.estaModoCrear) {
    agregarProducto();
  } else {
    actualizarProducto();
  }
}

async function agregarProducto() {
  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Guardando producto...',
      messageColor: 'white',
    });

    if (
      nombre.value !== null &&
      tipo.value !== null &&
      valorestimado.value !== null &&
      descripcion.value !== null
    ) {
      if (tipo.value !== null) {
        tipo.value = tipo.value.label;
      }
    }

    const producto = {
      nombre: nombre.value,
      tipo: tipo.value,
      valorestimado: valorestimado.value,
      descripcion: descripcion.value
    };


      await productosStore.agregarProducto(producto);

      $q.notify({
        progress: true,
        message: 'El producto se agrego satisfactoriamente. ',
        icon: 'save',
        color: 'white',
        textColor: 'primary',
      });

      router.back();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al agregar el producto: ' + error.message
    });
  } finally{
    $q.loading.hide();
  }
}

async function actualizarProducto() {
  if (tipo.value !== null) {
    tipo.value = tipo.value.label;
  }

  const producto = {
      id: props.producto.id,
      nombre: nombre.value,
      tipo: tipo.value,
      valorestimado: valorestimado.value,
      descripcion: descripcion.value
    };

    if (JSON.stringify(productoAuxiliar.value) === JSON.stringify(producto)) {
    $q.notify({
      progress: true,
      message: 'Sin cambios en el los datos del producto. ',
      icon: 'warning',
      color: 'secondary',
      textColor: 'white',
    });
    router.push('/main/productos');
    return;
  }
  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Actualizando producto...',
      messageColor: 'white',
    });
    await productosStore.actualizarProducto(producto);
    $q.notify({
      progress: true,
      message: 'El producto se actualizo satisfactoriamente. ',
      icon: 'save',
      color: 'white',
      textColor: 'primary',
    });
    router.push('/main/productos');
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

onMounted(async () => {
  try {
    $q.loading.show({
      backgroundColor: '#fff',
      message: 'Precargando datos...',
      messageColor: 'white',
    });

    if (!props.estaModoCrear) {
      const producto = props.producto;
      productoAuxiliar.value = props.producto;
      nombre.value = producto.nombre;
      tipo.value = producto.tipo;
      valorestimado.value = producto.valorestimado;
      descripcion.value = producto.descripcion;
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

async function onReset() {
  nombre.value = null;
  tipo.value = null;
  descripcion.value = '';
  valorestimado.value = 0;

  router.back();
}
</script>
