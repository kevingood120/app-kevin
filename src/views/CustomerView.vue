<template>
    <div>
        <h4 class="text-h4">Clientes</h4>
        <v-divider class="mb-2 mt-3"></v-divider>
        <v-text-field label="Pesquisar por nome" v-model="searchName"></v-text-field>
        <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1 mb-2"
            :server-items-length="serverSideTotal"
            :options.sync="pagination"
        >
        <template v-slot:item.address="{ item }">
            {{item.address.street}}, {{item.addressNumber}}
        </template>
        <template v-slot:item.createdAt="{ item }">
            {{item.createdAt | format-date}}
        </template>      
        <template v-slot:item.actions="{ item }">
            <v-btn icon @click="onEdit(item)" fab x-small>
                <v-icon v-text="'fa-pen'"/>
            </v-btn>
        </template>  
        </v-data-table>
        <v-btn color="success" @click="open = true">Adicionar</v-btn>
        <customer-form @submitend="submitEnd" v-model="open" :customer.sync="customer"/>
    </div>
</template>

<script lang="ts">
import { ICustomer } from '@/types'
import { Vue, Component, Ref, Inject, Watch } from 'vue-property-decorator'
import { DataTableHeader, DataPagination } from 'vuetify'
import {
    AddressService, CustomerService
} from '@/services/'
import CustomTextField from '@/components/CustomTextField.vue'
import {
    extend,
    ValidationObserver
} from 'vee-validate'

import CustomerForm from '@/forms/CustomerForm.vue'

@Component({
    components: {
        CustomerForm
    }
})
export default class CustomerView extends Vue {

    @Ref('addressNumber')
    readonly addressNumberRef!: CustomTextField

    @Ref('observer')
    readonly observerRef!: InstanceType<typeof ValidationObserver>

    open = false

    pagination: DataPagination = { } as DataPagination
    serverSideTotal = 0
    customerService = new CustomerService()
    searchName = ''

    headers: DataTableHeader[] = [
        {
            text: 'Nome',
            value: 'name',
        },
        {
            text: 'Criado em',
            value: 'createdAt'
        },
        {
            text: 'Email',
            value: 'email',
        },
        {
            text: 'Telefone',
            value: 'tel',
        },
        {
            text: 'Celular',
            value: 'cel',
        },
        {
            text: 'CPF',
            value: 'cpf',
        },
        {
            text: 'Logradouro',
            value: 'address',
        },
        {
            text: 'Cidade',
            value: 'address.city',
        },
        {
            text: 'UF',
            value: 'address.state',
        },
        {
            text: 'Complemento',
            value: 'complement',
        },
        {
            text: 'Observação',
            value: 'comments'
        },
        {
            text: 'Ações',
            value: 'actions'
        }
    ]

    customer: ICustomer = {
        address: { }
    } as ICustomer

    items: ICustomer[] = []

    async submitEnd() {
        await this.getDataFromApi()
    }

    async onEdit(item: ICustomer) {
        this.customer = item
        this.open = true
    }

    async getDataFromApi(){
        const { page, itemsPerPage } = this.pagination
        const response = await this.customerService.findAllPagination({
            page,
            limit: itemsPerPage,
            name: this.searchName
        })

        this.serverSideTotal = response.meta.totalRows
        this.items = response.rows
    }

    @Watch('pagination')
    async paginationChange(newValue: DataPagination) {
        await this.getDataFromApi()
    }
}
</script>