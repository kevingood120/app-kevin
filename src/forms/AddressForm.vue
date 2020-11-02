<template>
    <v-dialog
    v-model="dialog"
    persistent 
    max-width="500px"
    transition="dialog-transition"
        >
        <v-card>
            <v-toolbar dense color="primary" dark>
                <v-toolbar-title>
                    Endereço
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="closeDialog()" icon>
                    <v-icon v-text="'fa-times'"></v-icon>
                </v-btn>
            </v-toolbar>
            <validation-observer mode="" ref="observer" slim v-slot="{ handleSubmit, invalid }">
                <v-form autocomplete="off" @submit.prevent="handleSubmit(onSubmit)">
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="4">
                                <custom-text-field :rules="zipcodeRules" v-mask="'#####-###'" v-model="address.zipcode" label="CEP"></custom-text-field>
                            </v-col>
                            <v-col cols="8">
                                <custom-text-field v-model="address.street" rules="required" label="Logradouro"></custom-text-field>
                            </v-col>
                            <v-col cols="4">
                                <custom-text-field v-model="address.neighborhood" rules="required" label="Bairro"></custom-text-field>
                            </v-col>
                            <v-col cols="4">
                                <custom-text-field v-model="address.city" rules="required" label="Cidade"></custom-text-field>
                            </v-col>
                            <v-col cols="4">
                                <custom-text-field v-model="address.state" rules="required|length:2|alpha" maxLength="2" label="UF"></custom-text-field>
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
import { AddressService } from '@/services';
import { IAddress } from '@/types';
import { ValidationObserver } from 'vee-validate';
import { Component, Model, Prop, Ref, Vue } from 'vue-property-decorator';


@Component({
    name: 'AddressForm'
})
export default class AddressForm extends Vue {

    addressService = new AddressService()

    @Ref('observer')
    observerRef!: InstanceType<typeof ValidationObserver>

    @Prop({
        type: Boolean,
        default: false
    })
    dialog!: boolean

    @Model('update:address', {
        type: Object,
        required: true,
        default: () => ({})
    })
    address!: IAddress

    get _dialog() {
        return this.dialog
    }

    set _dialog(value) {
        this.$emit('update:dialog', value)
    }

    get _address() {
        return this.address
    }

    set _address(value: IAddress) {
        this.$emit('update:address', value)
    }

    get zipcodeRules() {            
        return {
            required: true,
            length: 9,
            unique: {
                service: this.addressService,
                id: this.address.id,
                field: 'zipcode'
            },
            
        }
    }

    reset() {
        this.observerRef.reset()
        this._address = { } as IAddress
    }

    closeDialog() {
        this.reset()
        this._dialog = false
    }

    async onSubmit() {
        const address = await this.addressService.add(this._address)
        this.$emit('saved', address)
        this.reset()
    }

}
</script>
