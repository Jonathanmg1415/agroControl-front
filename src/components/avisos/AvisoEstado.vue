<template>
  <div>
    <q-card flat>
      <q-toolbar class="info_card">
        <q-avatar square>

        </q-avatar>
        <q-toolbar-title>
          <span class="text-secondary text-weight-bold">Pixie Inc was here</span>
        </q-toolbar-title>
        <q-btn round v-if="cancelar" class="card2 text-white" flat icon="cancel" @click="$emit('ocultarAviso', false)">
        </q-btn>
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">
          {{ texto }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>

const props = defineProps({
  texto: { type: String },
  cancelar: { type: Boolean },
})
</script>

<style scoped>
.info_card {
  background: rgb(186, 203, 222);
  background: linear-gradient(
    100deg,
    rgba(186, 203, 222, 1) 19%,
    rgba(157, 171, 194, 1) 74%
  );
}
</style>
