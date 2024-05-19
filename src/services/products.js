import useApi from 'src/composables/UseApi'

export default function productsService() {
    const {list, post, update, remove, getById} = useApi('products')


return {
    list, 
    post, 
    update, 
    remove,
    getById
}
}