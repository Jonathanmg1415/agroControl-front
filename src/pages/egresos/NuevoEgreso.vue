<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <actualizar-egreso :estaModoCrear="true" :estaModoVista="false" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const ActualizarEgreso = defineAsyncComponent(() =>
  import('src/components/egresos/ActualizarEgreso.vue')
);
</script>
