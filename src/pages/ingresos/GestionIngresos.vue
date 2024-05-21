<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <filtro-ingresos />
      </q-card-section>
      <q-card-section>
        <lista-ingresos />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ListaIngresos = defineAsyncComponent(() =>
  import("src/components/ingresos/ListaIngresos.vue")
);

const FiltroIngresos = defineAsyncComponent(() =>
  import("src/components/ingresos/FiltroIngresos.vue")
);
</script>
