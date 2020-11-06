<template>
    <v-dialog
            v-model="open"
            persistent 
            max-width="400px"
            transition="dialog-transition"
        >
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title>
                    Produto
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="Open = false" icon>
                    <v-icon v-text="'fa-times'"></v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                    <v-form @submit.prevent="handleSubmit(onSubmit)">
                        <v-row dense>
                            <v-col cols="12">
                                <custom-text-field rules="required" type="select" return-object item-text="desc" v-model="Product.productGroup" item-value="id" :items="productGroups" label="Grupos"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field rules="required" v-model="Product.desc" label="Descrição"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field rules="required" type="select" return-object item-text="desc" v-model="Product.brand" item-value="id" :items="brands" label="Marca"></custom-text-field>
                            </v-col>
                            <v-col cols="6">
                                <money-text-field rules="required" v-model="Product.purchasePrice" label="Preço de compra"></money-text-field>
                            </v-col>
                            <v-col cols="6">
                                <money-text-field rules="required" v-model="Product.salePrice" label="Preço de venda"></money-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field rules="required" type="select" label="Medida" v-model="Product.unit" :items="units"/>
                            </v-col>
                            <v-col cols="6">
                                <custom-text-field rules="required" v-model.number="Product.stock" type="number" label="Estoque"></custom-text-field>
                            </v-col>
                            <v-col cols="6">
                                <custom-text-field rules="required" v-model.number="Product.minStock" type="number" label="Estoque mínimo"></custom-text-field>
                            </v-col>
                        </v-row>
                        <v-btn class="mt-2" type="submit" color="success">Enviar</v-btn>
                    </v-form>
                </validation-observer>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref, Prop, Model } from 'vue-property-decorator'
import { IBrand, IProduct, IProductGroup, Units } from '../types'
import {
    ValidationObserver
} from 'vee-validate'

import {
    BrandService,
    ProductGroupService,
    ProductService
} from '@/services'

@Component({
    components: {
        ValidationObserver
    },
    name: 'ProductForm'
})
export default class ProductForm extends Vue {

    brandService = new BrandService()
    productService = new ProductService()
    productGroupService = new ProductGroupService()

    brands: IBrand[] = []
    productGroups: IProductGroup[] = []
    units = Units

    @Ref('observer')
    readonly observer!: InstanceType<typeof ValidationObserver>

    @Prop({
        type: Object,
        required: true,
        default: () => ({ })
    })
    product!: IProduct

    @Model('update:open',{
        type: Boolean,
        required: true,
        default: false
    })
    open!: boolean

    get Product() {
        return this.product
    }

    set Product(product: IProduct) {
        this.$emit('update:product', product)
    }

    get Open() {
        return this.open
    }

    set Open(open: boolean) {
        this.reset()
        this.$emit('update:open', open)
    }

    reset() {
        this.Product = { } as IProduct
        this.observer.reset()
    }

    async onSubmit() {
        const newProduct = await this.productService.save(this.Product)
        this.reset()
        this.$emit('submitend', newProduct)
    }

    async created() {
        this.brands = await this.brandService.findAll()
        this.productGroups = await this.productGroupService.findAll()
    }
} 
</script>