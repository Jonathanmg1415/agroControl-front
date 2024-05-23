<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-toolbar class="bg-grey-5">
        <q-avatar round color="white">
          <q-icon name="add_card" />
        </q-avatar>
        <div class="text-weight-medium q-pl-sm fontG text-h6">
          Formulario de ingreso de ingreso
        </div>
      </q-toolbar>

      <div class="row q-col-gutter-sm">
        <div
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-weight-bold fontG"
        >
          Datos generales del ingreso
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            filled
            v-model="ingreso.valor"
            label="Valor total"
            type="number"
            :rules="[(val) => val > 0 || 'El valor debe ser positivo']"
          >
            <template v-slot:append>
              <q-icon name="attach_money" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input
            filled
            label="Ingrese la fecha del ingreso"
            outlined
            v-model="ingreso.fecha"
            mask="date"
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
                    v-model="ingreso.fecha"
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
          <q-input filled v-model="ingreso.descripcion" label="Descripción">
            <template v-slot:append>
              <q-icon name="description" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-input filled v-model="ingreso.nombre" label="Nombre">
            <template v-slot:append>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="text-right q-mt-md">
        <q-btn label="Guardar" type="submit" color="secondary" />
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
import { ref } from "vue";
import { useIngresosStore } from "stores/ingresos-store";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const dateNow = ref(Date.now());
const today = ref(date.formatDate(dateNow.value, "YYYY/MM/DD"));
const fechasEs = ref({
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
});
function validacionFecha(fecha) {
  return fecha <= today.value;
}


const ingreso = ref({
  valorTotal: "",
  fechaIngreso: "",
  descripcion: "",
  nombre: "",
});

const ingresosStore = useIngresosStore();
const $q = useQuasar();

const onSubmit = async () => {
  try {
    await ingresosStore.crearIngreso(ingreso.value);

    $q.notify({
      message: "Ingreso guardado con éxito",
      color: "white",
      textColor: "orange",
      timeout: 2000,
    });
    onReset();

    router.back();
  } catch (error) {
    console.error("Error al guardar el ingreso:", error.message);
    $q.notify({
      message: "Error al guardar el ingreso",
      color: "negative",
      timeout: 2000,
    });
  }
};

const onReset = () => {
  ingreso.value = {
    valor: "",
    fecha: "",
    descripcion: "",
    nombre: "",
  };
  router.back();
};
</script>

<style scoped>
.fontG {
  font-size: 1.2em;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
