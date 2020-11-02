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
        <v-dialog
            v-model="dialog"
            persistent 
            max-width="500px"
            transition="dialog-transition"
        >
            <template #activator="{ on }">
                <v-btn color="success" v-on="on">Adicionar</v-btn>
            </template>
            <v-card>
                <v-toolbar dense color="primary" dark>
                    <v-toolbar-title>
                        Cliente
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog" icon>
                        <v-icon v-text="'fa-times'"></v-icon>
                    </v-btn>
                </v-toolbar>
                <validation-observer ref="observer" slim v-slot="{ handleSubmit, invalid }">
                    <v-form autocomplete="off" @submit.prevent="handleSubmit(onSubmit)">
                        <v-container fluid>
                            <v-row dense>
                                <v-col cols="12">
                                    <custom-text-field v-model="customer.name" rules="required" label="Nome"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <custom-text-field :rules="emailRules" v-model="customer.email" label="Email"></custom-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field v-model="customer.tel" v-mask="'(##)####-####'" label="Telefone"></custom-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field v-model="customer.cel" v-mask="'(##)#####-####'" label="Celular"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <custom-text-field v-model="customer.cpf" :rules="cpfRules" v-mask="'###.###.###-##'" label="CPF"></custom-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <custom-text-field @input="handleInputZipcode" :rules="zipcodeRules" v-mask="'#####-###'" v-model="customer.address.zipcode" label="CEP"></custom-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <custom-text-field readonly tabindex="-1" v-model="customer.address.street" label="Logradouro"></custom-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <custom-text-field ref="addressNumber" v-model="customer.addressNumber" label="Número"></custom-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <custom-text-field readonly tabindex="-1" v-model="customer.address.neighborhood" label="Bairro"></custom-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <custom-text-field readonly tabindex="-1" v-model="customer.address.city" label="Cidade"></custom-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <custom-text-field readonly tabindex="-1" v-model="customer.address.state" maxLength="2" label="UF"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <custom-text-field v-model="customer.complement" label="Complemento"></custom-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <custom-text-field v-model="customer.comments" type="textarea" rows="3" no-resize label="Observação"></custom-text-field>
                                </v-col>
                            </v-row>
                            <v-btn type="submit" :disabled="invalid" color="success">Enviar</v-btn>
                        </v-container>
                    </v-form>
                </validation-observer>
            </v-card>
        </v-dialog>
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

@Component({

})
export default class CustomerView extends Vue {

    @Ref('addressNumber')
    readonly addressNumberRef!: CustomTextField

    @Ref('observer')
    readonly observerRef!: InstanceType<typeof ValidationObserver>

    dialog = false
    addressService = new AddressService()
    customerService = new CustomerService()

    pagination: DataPagination = { } as DataPagination
    serverSideTotal = 0
    searchName = ''

    get cpfRules() {
        return {
            required: true,
            length: 14,
            cpf: true,
            unique: {
                service: this.customerService,
                field: 'cpf',
                id: this.customer.id
            }
        }
    }

    get emailRules() {
        return {
            required: true,
            email: true,
            unique: {
                service: this.customerService,
                field: 'email',
                id: this.customer.id
            }
        }
    }

    get zipcodeRules() {
        return {
            required: true,
            length: 9,
            address: this.customer.address.id
        }
    }

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

    reset() {
        this.customer = {
            address: { }
        } as ICustomer
        this.observerRef.reset()
    }

    async closeDialog() 
    {
        this.reset()
        await this.getDataFromApi()
        this.dialog = false
    }

    async handleInputZipcode() {
        const { zipcode } = this.customer.address
        if(zipcode.length === 9) {
            const address =  await this.addressService.findOne({
                zipcode
            })

            if(address) {
                this.customer.address = address
                this.addressNumberRef.inputRef.focus()
            }
            else {
                this.customer.address.id = ''
            }

        }
    }

    async onSubmit() {
        const response = await this.customerService.add(this.customer)
        this.reset()

    }

    async onEdit(item: ICustomer) {
        this.customer = item
        this.dialog = true
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

    @Watch('searchName')
    async searchNameChange(newValue: string) {
        await this.getDataFromApi()
    }

    mounted() {
        extend('cpfUnique', {
            validate: async (cpf, args) => {
                const { id } = args as any
                const customer = await this.customerService.findOne({
                    cpf
                })
                console.log(cpf)
                return !(customer && customer.id !== id)
            },
            params: ['id'],
            message: 'CPF já cadastrado'
        })

        extend('emailUnique', {
            validate: async (email, args) => {
                const { id } = args as any
                const customer = await this.customerService.findOne({
                    email
                })
                return !(customer && customer.id !== id)
            },
            params: ['id'],
            message: 'Email já cadastrado'
        })

        extend('address', {
            validate: (value, args) => {
                const { id } = args as any
                return !!id
            },
            params: ['id'],
            message: 'Endereço não encontrado'
        })

        extend('cpf', {
            validate: (cpf: string) => {
                const cpfWithoutMask = cpf.replace(/[\D]/g, '') 
                const firstDigit = cpfWithoutMask.slice(9,10)
                const secondDigit = cpfWithoutMask.slice(10,11)

                let validate = false
                for(const char of cpfWithoutMask) {
                    if(char !== firstDigit) validate = true
                }

                if(!validate) return false
                
                let firstResult = [10,9,8,7,6,5,4,3,2].map((item, i) => {
                    const digit = parseInt(cpfWithoutMask[i])
                    return digit * item
                }).reduce((prev, cur) => prev + cur, 0)

                firstResult = (firstResult * 10) % 11
                firstResult = firstResult > 9 ? 0 : firstResult

                if(firstResult.toString() === firstDigit) {
                    let secondResult = [11,10,9,8,7,6,5,4,3,2].map((item, i) => {
                        const digit = parseInt(cpfWithoutMask[i])
                        return digit * item
                    }).reduce((prev, cur) => prev + cur, 0)

                    secondResult = (secondResult * 10) % 11
                    secondResult = secondResult > 9 ? 0 : secondResult

                    return secondResult.toString() === secondDigit
                }
                else return false
            },
            message: 'CPF inválido'
        })
    }
}
</script>