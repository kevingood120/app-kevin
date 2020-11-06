<template>
    <v-dialog persistent width="380px" v-model="_dialog">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>
                    Serviço
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn @click="closeDialog()" icon>
                    <v-icon v-text="'fa-times'"></v-icon>
                </v-btn>
            </v-toolbar>         
            <v-container fluid>
                <validation-observer ref="observer" slim v-slot="{ handleSubmit, invalid }">
                    <v-form @submit.prevent="handleSubmit(onSubmit)">
                        <custom-text-field :rules="descRules" v-model="_task.desc" label="Descrição"></custom-text-field>
                        <money-text-field rules="required" v-model="_task.price" label="Preço"></money-text-field>
                        <v-btn class="mt-1" type="submit" :disabled="invalid" color="success">Salvar</v-btn>
                    </v-form>
                </validation-observer>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { TaskService } from '@/services'
import { ITask } from '@/types'
import { ValidationObserver } from 'vee-validate'
import { Vue, Component, Prop, Model, Ref } from 'vue-property-decorator'

@Component({
    name: 'TaskForm'
})
export default class TaskForm extends Vue {

    @Ref('observer')
    readonly observerRef!: InstanceType<typeof ValidationObserver>

    taskService = new TaskService()

    @Prop({
        type: Boolean,
        required: true
    })
    dialog!: boolean

    get descRules() {
        return {
            unique: {
                service: this.taskService,
                field: 'desc',
                id: this.task.id
            },
            required: true,
            max: 100
        }
    }

    @Model('update:task', {
        type: Object,
        required: true
    })
    task!: ITask

    get _dialog() {
        return this.dialog
    }
    
    set _dialog(value: boolean) {
        this.$emit('update:dialog', value)
    }

    get _task() {
        return this.task
    }

    set _task(value: ITask) {

        this.$emit('update:task', value)
    }

    reset() {
        this._task = { } as ITask
        this.observerRef.reset()
    }

    closeDialog() {
        this.reset()
        this._dialog = false
    }

    async onSubmit() {
        await this.taskService.add(this._task)
        this.reset()
        this.$emit('saved')
    }

}
</script>

<style>

</style>