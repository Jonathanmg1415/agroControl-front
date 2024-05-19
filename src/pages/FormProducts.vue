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
        <q-input
            outlined
            v-model="form.type"
            label="Tipo"
            lazy-rules
            class="col-lg-4 col-xs-12"
            :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
         />
         <q-input
            outlined
            v-model="form.estimated_value"
            label="Valor estimado"
            lazy-rules
            class="col-lg-4 col-xs-12"
            :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
         />
         <div class="col-lg-12 col-xs-12">
            <q-editor 
                v-model="form.description" 
                min-height="5rem"
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

<script>
import { defineComponent, ref, onMounted  } from 'vue'
import productsService from 'src/services/products'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    name: 'FormProduct',
    setup(){
      const { post, getById, update } = productsService()
      const $q = useQuasar()
      const router = useRouter()
      const route = useRoute()
      const form = ref({
        name: '',
        type: '',
        estimated_value: '',
        description: ''
      })

      onMounted(async() => {
        if(route.params.id){
          getProduct(route.params.id)
        }
      })

      const getProduct = async (id) => {
        try {
            const response = await getById(id)
            form.value = response
        } catch (error) {
            console.error(error)
        }
      }

      const onSubmit = async () => {
        try{
            if(form.value.id){
                await update(form.value)
            } else {
                await post(form.value)
            }
            $q.notify({message: '¡Producto creado exitosamente!', icon: 'check', color: 'positive' })
            router.push({name: 'products'})
        } catch (error){
            console.error(error)
        }
      }

      return {
        form,
        onSubmit
      }
    }
})
</script>
