<template>
    <v-dialog
            v-model="Open"
            persistent 
            max-width="500px"
            transition="dialog-transition"
        >
        <v-card>
            <v-toolbar dense color="primary" dark>
                <v-toolbar-title>
                    Cliente
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="Open = false" icon>
                    <v-icon v-text="'fa-times'"></v-icon>
                </v-btn>
            </v-toolbar>
            <validation-observer ref="observer" slim v-slot="{ handleSubmit, invalid }">
                <v-form autocomplete="off" @submit.prevent="handleSubmit(onSubmit)">
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12">
                                <custom-text-field v-model="Customer.name" rules="required" label="Nome"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field :rules="emailRules" v-model="Customer.email" label="Email"></custom-text-field>
                            </v-col>
                            <v-col cols="6">
                                <custom-text-field v-model="Customer.tel" v-mask="'(##)####-####'" label="Telefone"></custom-text-field>
                            </v-col>
                            <v-col cols="6">
                                <custom-text-field v-model="Customer.cel" v-mask="'(##)#####-####'" label="Celular"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field v-model="Customer.cpf" :rules="cpfRules" v-mask="'###.###.###-##'" label="CPF"></custom-text-field>
                            </v-col>
                            <v-col cols="4">
                                <custom-text-field @input="handleInputZipcode" :rules="zipcodeRules" v-mask="'#####-###'" v-model="Customer.address.zipcode" label="CEP"></custom-text-field>
                            </v-col>
                            <v-col cols="6">
                                <custom-text-field readonly tabindex="-1" v-model="Customer.address.street" label="Logradouro"></custom-text-field>
                            </v-col>
                            <v-col cols="2">
                                <custom-text-field ref="addressNumber" v-model="Customer.addressNumber" label="Número"></custom-text-field>
                            </v-col>
                            <v-col cols="5">
                                <custom-text-field readonly tabindex="-1" v-model="Customer.address.neighborhood" label="Bairro"></custom-text-field>
                            </v-col>
                            <v-col cols="5">
                                <custom-text-field readonly tabindex="-1" v-model="Customer.address.city" label="Cidade"></custom-text-field>
                            </v-col>
                            <v-col cols="2">
                                <custom-text-field readonly tabindex="-1" v-model="Customer.address.state" maxLength="2" label="UF"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field v-model="Customer.complement" label="Complemento"></custom-text-field>
                            </v-col>
                            <v-col cols="12">
                                <custom-text-field v-model="Customer.comments" type="textarea" rows="3" no-resize label="Observação"></custom-text-field>
                            </v-col>
                        </v-row>
                        <v-btn type="submit" :disabled="invalid" color="success">Enviar</v-btn>
                    </v-container>
                </v-form>
            </validation-observer>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { ICustomer } from '@/types'
import { Vue, Component, Watch, Ref, Prop, Model } from 'vue-property-decorator'
import {
    ValidationObserver,
    extend
} from 'vee-validate'

import {
    AddressService,
    CustomerService
} from '@/services'

@Component({
    name: 'CustomerForm',
    components: {
        ValidationObserver
    }
})
export default class CustomerForm extends Vue {

    addressService = new AddressService()
    customerService = new CustomerService()

    @Ref('observer')
    readonly observerRef!: InstanceType<typeof ValidationObserver>

    @Ref('addressNumber')
    readonly addressNumberRef!: CustomTextField

    @Model('update:open', {
        type: Boolean,
        required: true,
        default: false
    })
    open!: boolean

    @Prop({
        type: Object,
        required: true,
        default: () => ({})
    })
    customer!: ICustomer

    get Customer() {
        return this.customer
    }

    set Customer(value) {
        this.$emit('update:customer', value)
    }

    get Open() {
        return this.open
    }

    set Open(value) {
        this.reset()
        this.$emit('update:open', value)
    }

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

    reset() {
        this.Customer = {
            address: { }
        } as ICustomer
        this.observerRef.reset()
    }

    async onSubmit() {
        const newCustomer = await this.customerService.add(this.customer)
        this.reset()
        this.$emit('submitend', newCustomer)
    }

    async handleInputZipcode() {
        const { zipcode } = this.Customer.address
        if(zipcode.length === 9) {
            const address =  await this.addressService.findOne({
                zipcode
            })

            if(address) {
                this.Customer.address = address
                this.addressNumberRef.inputRef.focus()
            }
            else {
                this.Customer.address.id = ''
            }

        }
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