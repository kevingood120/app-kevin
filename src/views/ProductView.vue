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
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onEdit(item)" fab x-small>
                    <v-icon v-text="'fa-pen'"/>
                </v-btn>
            </template> 
        </v-data-table>
        <v-dialog
            v-model="dialog"
            persistent 
            max-width="400px"
            transition="dialog-transition"
        >
            <template #activator="{ on }">
                <v-btn color="success" v-on="on">Adicionar</v-btn>
            </template>
            <v-card>
                <v-toolbar dense color="primary">
                    <v-toolbar-title>
                        Produto
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog" icon>
                        <v-icon v-text="'fa-times'"></v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container fluid>
                    <validation-observer ref="observer">
                        <v-form @submit.prevent="onSubmit">
                            <v-row dense>
                                <v-col cols="12">
                                    <custom-text-field v-model="product.desc" label="Descrição"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select return-object item-text="desc" v-model="product.brand" item-value="id" :items="brands" label="Marca"></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field prefix="R$" v-model="product.purchasePrice" label="Preço de compra"></custom-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field prefix="R$" v-model="product.salePrice" label="Preço de venda"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Medida" v-model="product.unit" :items="units"/>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field v-model.number="product.stock" type="number" label="Estoque"></custom-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field v-model.number="product.minStock" type="number" label="Estoque mínimo"></custom-text-field>
                                </v-col>
                            </v-row>
                            <v-btn type="submit" color="success">Enviar</v-btn>
                        </v-form>
                    </validation-observer>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { IBrand, IProduct, Units } from '@/types'
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import { DataPagination, DataTableHeader } from 'vuetify'
import {
    BrandService,
    ProductService
} from '@/services'

import {
    ValidationObserver
} from 'vee-validate'

@Component({
    components: {
        ValidationObserver
    }
})
export default class ProductView extends Vue {

    @Ref('observer')
    readonly observer!: InstanceType<typeof ValidationObserver>

    brandService = new BrandService()
    productService = new ProductService()

    headers: DataTableHeader[] = [
        {
            text: 'Descrição',
            value: 'desc'
        },
        {
            text: 'Marca',
            value: 'brand.desc'
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
        const [_] = this.units.filter(i => i.value === unit)
        return _.text
    }

    dialog = false
    brands: IBrand[] = []
    units = Units
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

    reset() {
        this.observer.reset() 
        this.product = { } as IProduct
    }

    async closeDialog() {
        this.dialog = false
        this.reset()
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

        console.table({rows, meta})

        this.items = rows
        this.serverSideTotal = meta.totalRows
    }

    async onSubmit() {
        let product!: IProduct
        if(this.product.id) 
            product = await this.productService.update(this.product.id, this.product)
        else 
            product = await this.productService.add(this.product)
        this.reset()
    }

    async created() {
        this.brands = await this.brandService.findAll()
    }


}
</script>

<style>

</style>