<template>
    <validation-provider slim :rules="rules" v-slot="{ errors }">
        <v-text-field maxlength="10" :error-messages="errors" v-bind="$attrs" v-on="$listeners" type="tel" prefix="R$" @keypress="onKeydown" v-model="money"/>
    </validation-provider>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue} from 'vue-property-decorator';
import { ValidationProvider } from "vee-validate";

@Component({
    components: {
        ValidationProvider
    }
})
export default class MoneyTextField extends Vue {
    @Model('update:currency')
    currency!: number

    @Prop({
        type: [Object, String],
        default: ""
    })
    rules!: any[]

    set money(newValue: string) {
        const value = newValue.replace(/\D/g, '')
            .replace(/(\d)(\d{2})$/, '$1.$2')
        this.$emit('update:currency', value)
    }

    get money() {

        const masked = String(this.currency || '')
            .replace(/\D/g, '')
            .replace(/(\d)(\d{2})$/, '$1,$2')
            .replace(/(?=(\d{3})+(\D))\B/g, '.')

        return masked
    }

    onKeydown(ev: KeyboardEvent) {
        const pattern = /\D/g
        if(pattern.test(ev.key))
            ev.preventDefault()
    }
}
</script>