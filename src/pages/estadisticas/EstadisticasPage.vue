<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row q-col-gutter-sm">
        <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12  q-pa-sm">
              <q-input
                filled
                v-model="startDateDisplay"
                mask="date"
                label="Fecha inicial "
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                    @click="showStartDatePicker = true"
                  />
                </template>
              </q-input>
              <q-popup-proxy
                v-model="showStartDatePicker"
                transition-show="scale"
                transition-hide="scale"
                anchor="bottom right"
                self="top right"
              >
                <q-date
                  :locale="fechaEs"
                  v-model="fechaInicial"
                  minimal
                  @update:model-value="updateStartDate"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12  q-pa-sm">
              <q-input
                filled
                v-model="endDateDisplay"
                mask="date"
                label="Fecha final"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                    @click="showEndDatePicker = true"
                  />
                </template>
              </q-input>
              <q-popup-proxy
                v-model="showEndDatePicker"
                transition-show="scale"
                transition-hide="scale"
                anchor="bottom right"
                self="top right"
              >
                <q-date
                  :locale="fechaEs"
                  v-model="fechaFinal"
                  minimal
                  @update:model-value="updateEndDate"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </div>
            <div class="col-12  q-pa-sm">
              <q-btn
                label="Aplicar filtro"
                @click="applyFilter"
                color="primary"
              />
            </div>
          </div>
        </q-card>
        <div class="col-6 col-md-6">
          <q-card>
            <diagrama-barras :startDate="fechaInicial" :endDate="fechaFinal" />
          </q-card>
        </div>
        <div class="col-6 col-md-6">
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-6 col-md-6 q-pa-sm">
              <q-card>
                <q-card-section>
                  <div class="row items-center">
                    <q-icon
                      name="remove_circle"
                      color="negative"
                      class="col-auto"
                    />
                    <div class="text-subtitle1 col-auto">Total Egresos</div>
                  </div>
                  <div class=" text-h6 ">
                    ${{ totalEgresos.toLocaleString("es-CO") }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-md-6 q-pa-sm">
              <q-card>
                <q-card-section>
                  <div class="row items-center">
                    <q-icon
                      name="add_circle"
                      color="positive"
                      class="col-auto"
                    />
                    <div class="text-subtitle1 col-auto">Total Ingresos</div>
                  </div>
                  <div class="text-h6">
                    ${{ totalIngresos.toLocaleString("es-CO") }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-12">
              <q-card>
                <ultimos-movimientos />
              </q-card>
            </div>
          </q-card-section>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md"></div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { defineAsyncComponent } from "vue";
import { date } from "quasar";
import { useEstadisticasStore } from 'stores/estadisticas-store';


const store = useEstadisticasStore();
onMounted(() => {
  store.consultarIngresosMes(fechaInicial, fechaFinal);
});

const totalIngresos = computed(() => {
  return store.totalIngresos;
});
const totalEgresos = computed(() => {
  return store.totalEgresos;
});

const dateNow = ref(Date.now());
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
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
});

const fechaInicial = ref(
  date.formatDate(dateNow.value - 30 * 24 * 60 * 60 * 1000, "YYYY/MM/DD")
);
const fechaFinal = ref(date.formatDate(dateNow.value, "YYYY/MM/DD"));

const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const startDateDisplay = ref(date.formatDate(fechaInicial.value, "YYYY-MM-DD"));
const endDateDisplay = ref(date.formatDate(fechaFinal.value, "YYYY-MM-DD"));



const updateStartDate = (value) => {
  startDateDisplay.value = date.formatDate(value, "YYYY-MM-DD");
  if (fechaFinal.value < value) {
    fechaFinal.value = value;
  }
};

const updateEndDate = (value) => {
  endDateDisplay.value = date.formatDate(value, "YYYY-MM-DD");
  if (value < fechaInicial.value) {
    fechaInicial.value = value;
  }
};

watch(fechaInicial, (newValue) => {
  updateStartDate(newValue);
});

watch(fechaFinal, (newValue) => {
  updateEndDate(newValue);
});

const diagramaBarras = defineAsyncComponent(() =>
  import("src/components/graficos/diagrama-barras.vue")
);
const ultimosMovimientos = defineAsyncComponent(() =>
  import("src/components/graficos/ultimos-movimientos.vue")
);

const applyFilter = () => {
  console.log("Filtro aplicado:", fechaInicial.value, fechaFinal.value);
  calculateTotals();
};

const calculateTotals = () => {
  totalEgresos.value = 1000;
  totalIngresos.value = 1500;
};

calculateTotals();
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
