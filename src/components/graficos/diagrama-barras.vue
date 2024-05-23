<template>
  <div class="dashboard ">
    <div class="chart-container">
      <apexchart
        v-if="formattedSeries.length > 0"
        type="bar"
        :options="chartOptions"
        :series="formattedSeries"
      ></apexchart>
      <div v-else class="empty-chart-message">No hay datos disponibles</div> <!-- Mensaje cuando no hay datos -->
    </div>
    <q-item-label class="label">
      Ingresos y Egresos
    </q-item-label>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useEstadisticasStore } from 'stores/estadisticas-store';

const props = defineProps(["startDate", "endDate"]);
const store = useEstadisticasStore();
onMounted(() => {
  store.consultarIngresosMes(props.startDate, props.endDate);
});

const series = computed(() => {
  return store.series;
});

const formattedSeries = computed(() => {

  const ingresos = series.value.filter(item => item.tipo === 'Ingreso');
  const egresos = series.value.filter(item => item.tipo === 'Egreso');

  const ingresosData = {
    name: 'Ingresos',
    data: ingresos.map(item => ({ x: new Date(item.x).getTime(), y: item.y }))
  };

  const egresosData = {
    name: 'Egresos',
    data: egresos.map(item => ({ x: new Date(item.x).getTime(), y: item.y }))
  };

  return [ingresosData, egresosData];
});

const chartOptions = ref({
  chart: {
    type: "bar",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    type: "datetime", // Cambiar el tipo de categorías a fecha
  },
  yaxis: {
    title: {
      text: "Cantidad (COP)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(val);
      },
    },
  },
});



watch([() => props.startDate, () => props.endDate], ([newStartDate, newEndDate]) => {
  store.consultarIngresosMes(newStartDate, newEndDate);
});

</script>

<style>
.label {
  padding: 5px;
  font-size: 1vmax;
  color: white;
  font-weight: bold;
  display: flex;
}

.empty-chart-message {
  padding: 20px;
  font-size: 1.2em;
  color: #777;
}
</style>
