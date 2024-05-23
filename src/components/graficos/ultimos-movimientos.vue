<template>
  <q-card>
    <q-card-section class="text-h6">
      Últimos Movimientos del Mes
    </q-card-section>

    <q-list bordered class="rounded-borders" style="max-height: 423px; overflow-y: auto;">
      <q-item v-for="(movimiento, index) in filteredMovimientos" :key="index" class="q-mb-sm">
        <q-item-section avatar>
          <q-icon
            :name="movimiento.tipo === 'egreso' ? 'remove_circle' : 'add_circle'"
            :color="movimiento.tipo === 'ingreso' ? 'green' : 'red'"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ movimiento.descripcion }}</q-item-label>
          <q-item-label caption>{{ movimiento.fecha }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label :class="movimiento.tipo === 'ingreso' ? 'text-positive' : 'text-negative'">
            {{ movimiento.tipo === 'ingreso' ? '+' : '-' }} ${{ formatoDinero(movimiento.monto) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { useEstadisticasStore } from 'stores/estadisticas-store';
import { computed, onMounted } from 'vue';

const store = useEstadisticasStore();

onMounted(() => {
  store.consultarMovimientosUltimoMes();
});

const movimientos = computed(() => {
  return store.movimientos;
});

const filteredMovimientos = computed(() => {
  return movimientos.value ? movimientos.value.map((movimiento) => ({
    tipo: movimiento.tipo,
    descripcion: movimiento.descripcion,
    fecha: movimiento.fecha,
    monto: movimiento.monto,
  })) : [];
});

const formatoDinero = (monto) => {
  return new Intl.NumberFormat('es-CO').format(monto);
};
</script>

<style>
.text-positive {
  color: green;
}
.text-negative {
  color: red;
}
.rounded-borders {
  border-radius: 8px;
}
</style>
