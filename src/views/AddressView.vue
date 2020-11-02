<template>
    <div>
        <h4 class="text-h4">Endereços</h4>
        <v-divider class="mb-2 mt-3"></v-divider>
        <v-text-field v-model="searchStreet" label="Pesquisar por logradouro"></v-text-field>
        <v-data-table
            :search="searchStreet"
            :headers="headers"
            :items="items"
            class="elevation-1 mb-2"
            :server-items-length="serverSideTotal"
            :options.sync="pagination"
        >
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onEdit(item)" fab x-small>
                    <v-icon v-text="'fa-pen'"/>
                </v-btn>
            </template>
        </v-data-table>
        <v-btn color="success" @click="dialog = true">Adicionar</v-btn>
        <address-form @saved="onSavedAddress($event)" :dialog.sync="dialog" v-model="address"/>
    </div>
</template>

<script lang="ts">
import { IAddress, ICustomer } from '@/types'
import { Vue, Component, Ref, Inject, Watch } from 'vue-property-decorator'
import { DataTableHeader, DataPagination } from 'vuetify'
import {
    AddressService, CustomerService
} from '@/services/'

import AddressForm from '@/forms/AddressForm.vue'


@Component({
    components: {
        AddressForm
    }
})
export default class AddressView extends Vue {
    
    dialog = false
    address: IAddress = { } as IAddress
    addressService = new AddressService()

    pagination: DataPagination = { } as DataPagination
    serverSideTotal = 0
    searchStreet = ''


    headers: DataTableHeader[] = [
        {
            text: 'CEP',
            value: 'zipcode',
        },
        {
            text: 'Logradouro',
            value: 'street',
        },       
        {
            value: 'neighborhood',
            text: 'Bairro',
        },
        {
            value: 'city',
            text: 'Cidade'
        },
        {
            value: 'state',
            text: 'UF'
        },
        {
            value: 'actions',
            text: 'Ações'
        }
    ]

    items: IAddress[] = []

    async onEdit(item: IAddress) {
        this.address = { ...item}
        this.dialog = true
    }

    async onSavedAddress(address: IAddress) {
        await this.getDataFromApi()
    }

    async getDataFromApi(){
        const { page, itemsPerPage } = this.pagination
        const response = await this.addressService.findAllPagination({
            page,
            limit: itemsPerPage,
            street: this.searchStreet
        })

        this.serverSideTotal = response.meta.totalRows
        this.items = response.rows
    }

    @Watch('pagination')
    async paginationChange() {
        await this.getDataFromApi()
    }

    @Watch('searchStreet')
    async searchStreetChange() {
        await this.getDataFromApi()
    }
}
</script>