<template>
    <q-page padding>
        <q-form
            @submit="onSubmit"
            class="row q-col-gutter-sm"
        >
        <q-input
            outlined
            v-model="form.name"
            label="Nombre"
            lazy-rules
            class="col-lg-4 col-xs-12"
            :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
        />
        <q-select
            outlined
            v-model="form.type"
            :options="options"
            label="Tipo"
            class="col-lg-4 col-xs-12"
         />
         <q-input
            outlined
            v-model="form.estimated_value"
            label="Valor estimado"
            mask="#.#"
            reverse-fill-mask
            lazy-rules
            class="col-lg-4 col-xs-12"
            :rules="[val => val && val.length > 0 || 'Campo obligatorio', val => !isNaN(parseFloat(val)) || 'Debe ser un número']"
         />
         <div class="col-lg-12 col-xs-12">
            <q-input
                v-model="form.description" 
                label="Descripción"
                outlined
                autogrow
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
            />
         </div>

         <div class="col-12 q-gutter-sm">
            <q-btn 
                label="Guardar" 
                color="primary" 
                class ="float-right" 
                icon="save"
                type="submit"
            />
            <q-btn 
                label="Cancelar" 
                color="white" 
                class ="float-right" 
                text-color="primary"
                :to="{name:'products'}"
            />
         </div>        
        </q-form>
    </q-page>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductosStore } from 'stores/productos-store';

const $q = useQuasar();
const router = useRouter();
const productosStore = useProductosStore();

const form = ref({
  name: '',
  type: '',
  estimated_value: '',
  description: ''
});

const options = [
  { label: 'Abono', value: "Abono" },
  { label: 'Químico', value: "Químico" },
  { label: 'Mano de obra', value: "Mano de obra" }
];

async function onSubmit() {
  try {    
    const valorEstimado = parseFloat(form.value.estimated_value);

     if (isNaN(valorEstimado)) {
      $q.notify({
        type: 'negative',
        message: 'El valor estimado debe ser un número'
      });
      return;
    }

    const data = {
      nombre: form.value.name,
      tipo: form.value.type.value,
      valorestimado: valorEstimado, 
      descripcion: form.value.description
    };

    console.log('Objeto', data);

    if (!isNaN(parseFloat(form.value.estimated_value))) {
      await productosStore.agregarProducto({
        nombre: form.value.name,
        tipo: form.value.type.value, 
        valorestimado: valorEstimado, 
        descripcion: form.value.description
      });

      $q.notify({
        type: 'positive',
        message: 'Producto agregado con éxito'
      });

      router.push({ name: 'products' });
    } else {
      $q.notify({
        type: 'negative',
        message: 'El valor estimado debe ser un número'
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al agregar el producto: ' + error.message
    });
  }
}
</script>