<template>
    <q-page padding>
        <q-table
            title="Productos"
            :rows="products"
            :columns="columns"
            row-key="name"
            >
            <template v-slot:top>
                <span class="text-h5">Productos</span>
                <q-space />
                <q-btn color="primary" label="Nuevo" :to="{name: 'FormProduct'}" />
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-sm">
                    <q-btn icon="edit" color="info" dense size="sm" @click="handleEditProduct(props.row.id)" />
                    <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeleteProduct(props.row.id)" />
                </q-td>
            </template>
        </q-table>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
//import { api } from 'boot/axios'
import productsService from 'src/services/products'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
    name:'ProductsPage',
    setup(){
        const products = ref([])
        const { list, remove } = productsService()
        const columns = [
  { name: 'id', field: 'id', label: 'Id', sortable: true, align: 'left'},
  { name: 'name', field: 'name', label: 'Nombre', sortable: true, align: 'left' },
  { name: 'type', field: 'type', label: 'Tipo', sortable: true, align: 'left' },
  { name: 'estimated_value', field: 'estimated_value', label: 'Valor Estimado', sortable: true, align: 'left' },
  { name: 'description', field: 'description', label: 'Descripción', sortable: true, align: 'left' },
  { name: 'actions', field: 'actions', label: 'Acciones', sortable: true, align: 'right' }
]
const $q = useQuasar()
const router = useRouter()

onMounted(() => {
    getProducts()
})

const getProducts = async() => {
    try {
      const data = await list()
      products.value = data
    } catch (error) {
       console.error(error)
    }
}

const handleDeleteProduct = async (id) => {
    try {
        $q.dialog({
            title:'Eliminar',
            message: '¿Desea eliminar este producto?',
            cancel: true,
            persistent: true
        }).onOk(async() => {
            await remove(id)
            $q.notify({message: 'Eliminado exitosamente', icon: 'check', color: 'positive' })
            await getProducts()
        })         
    } catch (error) {
        $q.notify({message: 'Error al eliminar el producto', icon: 'times', color: 'negative' })
    }
}

const handleEditProduct = (id) => {
    router.push({name: 'FormProduct', params: { id } })
}
        return{
            products,
            columns,
            handleDeleteProduct,
            handleEditProduct
        }
    }
})
</script>