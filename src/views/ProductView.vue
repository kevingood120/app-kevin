<template>
    <div>
        <h4 class="text-h4">Produtos</h4>
        <v-divider class="mb-2 mt-3"></v-divider>
        <v-data-table
            :headers="headers"
            :items="items"
            :server-items-length="serverSideTotal"
            :options.sync="pagination"
            class="elevation-1 mb-2"
        >
            <template v-slot:item.unit="{ item }">
                {{getUnit(item.unit)}}
            </template>
            <template v-slot:item.purchasePrice="{ item }">
                {{item.purchasePrice | currency}}
            </template>
            <template v-slot:item.salePrice="{ item }">
                {{item.salePrice | currency}}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onEdit(item)" fab x-small>
                    <v-icon v-text="'fa-pen'"/>
                </v-btn>
            </template> 
            <template v-slot:item.createdAt="{ item }">
                {{item.createdAt | format-date}}
            </template> 
        </v-data-table>
        <v-btn @click="dialog = true" color="success">Adicionar</v-btn>
        <product-form @submitend="submitEnd" v-model="dialog" :product.sync="product"/>
    </div>
</template>

<script lang="ts">
import { IBrand, IProduct, IProductGroup, Units } from '@/types'
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import { DataPagination, DataTableHeader } from 'vuetify'
import ProductForm from '@/forms/ProductForm.vue'
import {
    BrandService,
    ProductGroupService,
    ProductService
} from '@/services'

import {
    ValidationObserver
} from 'vee-validate'

@Component({
    components: {
        ValidationObserver,
        ProductForm
    }
})
export default class ProductView extends Vue {

    @Ref('observer')
    readonly observer!: InstanceType<typeof ValidationObserver>

    productService = new ProductService()

    headers: DataTableHeader[] = [
        {
            text: 'Grupo',
            value: 'productGroup.desc'
        },
        {
            text: 'Marca',
            value: 'brand.desc'
        },
        {
            text: 'Descrição',
            value: 'desc'
        },
        {
            text: 'Criado em',
            value: 'createdAt'
        },
        {
            text: 'Preço de compra',
            value: 'purchasePrice'
        },
        {
            text: 'Preço de venda',
            value: 'salePrice'
        },
        {
            text: 'Unidade',
            value: 'unit'
        },
        {
            text: 'Estoque',
            value: 'stock'
        },
        {
            text: 'Estoque mínimo',
            value: 'minStock'
        },
        {
            text: 'Ações',
            value: 'actions'
        }
    ]

    getUnit(unit: number) {
        const [_] = Units.filter(i => i.value === unit)
        return _.text
    }

    dialog = false
    items: IProduct[] = []
    pagination: DataPagination = { } as DataPagination
    serverSideTotal = 0
    product: IProduct = {
        brand: { }
    } as IProduct

    @Watch('pagination')
    async paginationChanged() {
        await this.getDataFromApi()
    }

    async onEdit(item: IProduct) {
        this.product = { ...item}
        this.dialog = true
    }

    async getDataFromApi() {
        const { rows, meta } = await this.productService.findAllPagination({
            page: this.pagination.page,
            limit: this.pagination.itemsPerPage
        })

        this.items = rows
        this.serverSideTotal = meta.totalRows
    }

    async submitEnd() {
        await this.getDataFromApi()
    }
}
</script>