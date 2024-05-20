<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <filtro-egresos />
      </q-card-section>
      <q-card-section>
        <lista-egresos />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ListaEgresos = defineAsyncComponent(() =>
  import("src/components/egresos/ListaEgresos.vue")
);

const FiltroEgresos = defineAsyncComponent(() =>
  import("src/components/egresos/FiltroEgresos.vue")
);
</script>
