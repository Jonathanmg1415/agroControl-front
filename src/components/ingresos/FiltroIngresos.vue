<template>
  <q-card flat>
    <q-card-section>
      <div style="width: 100%" class="bg-transparent">
        <q-form
          class="row q-col-gutter-sm"
          @submit.prevent="actualizarTabla"
          @reset="limpiarFiltro"
        >
          <!-- parametro del egreso -->

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              filled
              v-model="ingresoBusqueda"
              label="Nombre del ingreso"
            />
          </div>

          <!-- parametro de fecha inicial -->

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              filled
              v-model="fechaInicial"
              mask="date"
              label="Rango de fecha inicial para la búsqueda"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :locale="fechaEs"
                      v-model="fechaInicial"
                      :options="opcionesFechaInicial"
                      minimal
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

          <!-- parametro de fecha final -->

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              filled
              v-model="fechaFinal"
              mask="date"
              label="Rango de fecha final para la búsqueda"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :locale="fechaEs"
                      v-model="fechaFinal"
                      :options="opcionesFechaFinal"
                      minimal
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
import { useIngresosStore } from "stores/ingresos-store.js";

const $q = useQuasar();
const ingresosStore = useIngresosStore();

const dateNow = ref(Date.now());
const today = ref(date.formatDate(dateNow.value, "YYYY/MM/DD"));
const dateAfter = ref(
  date.formatDate(
    date.subtractFromDate(dateNow.value, { year: 1 }),
    "YYYY/MM/DD"
  )
);

const fechaInicial = ref(dateAfter.value);
const fechaFinal = ref(today.value);
const ingresoBusqueda = ref("");

const fechaEs = ref({
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
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ],
});

async function actualizarTabla() {
  try {
    $q.loading.show({
      message: "Cargando ingresos...",
    });

    const fechaFinalModificada = date.formatDate(
      date.addToDate(fechaFinal.value, { days: 1 }),
      "YYYY/MM/DD"
    );

    const filtroBusqueda = {
      fechaInicial: fechaInicial.value,
      fechaFinal: fechaFinalModificada,
      ingresoBusqueda: ingresoBusqueda.value,
    };

    ingresosStore.filter = filtroBusqueda;
    ingresosStore.pagination = ingresosStore.paginationOriginal;
    await ingresosStore.cargarIngresos(true);
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
  ingresoBusqueda.value = "";
  fechaInicial.value = dateAfter.value;
  fechaFinal.value = today.value;
}

function opcionesFechaFinal(fechaFinal) {
  return fechaFinal >= fechaInicial.value;
}
function opcionesFechaInicial(fechaInicial) {
  return fechaInicial <= fechaFinal.value;
}
</script>
