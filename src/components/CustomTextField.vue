<template>
  <ValidationProvider slim :rules="rules" v-slot="{ errors }">
    <v-textarea
        v-if="$attrs.type === 'textarea'"
        :error-messages="errors"
        v-bind="$attrs"
        ref="input"
        v-on="$listeners"
    >
    </v-textarea>
    <v-text-field
        v-else
        ref="input"
        :error-messages="errors"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-text-field>
  </ValidationProvider>
</template>

<script lang="ts">
import { ValidationProvider } from "vee-validate";
import { Vue, Prop, Component, Watch, Ref } from 'vue-property-decorator'

@Component({
    components: {
        ValidationProvider
    }
})
export default class CustomTextField extends Vue {
    @Prop({
        type: [Object, String],
        default: ""
    })
    rules!: any[]

    @Ref('input')
    readonly inputRef!: HTMLInputElement
}
</script>