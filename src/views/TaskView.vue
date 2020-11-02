<template>
    <div class="task">
        <h4 class="text-h4">Serviços</h4>
        <v-divider class="mb-2 mt-3"></v-divider>
        <v-data-table :items="items" :search="searchDesc" :headers="headers" disable-pagination hide-default-footer class="elevation-1 mb-2">
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onEdit(item)" fab x-small>
                    <v-icon v-text="'fa-pen'"/>
                </v-btn>
            </template> 
            <template v-slot:item.price="{ item }">
                {{item.price | currency}}
            </template> 
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onEdit(item)" fab x-small>
                    <v-icon v-text="'fa-pen'"/>
                </v-btn>
            </template> 
        </v-data-table>
        <v-btn @click="dialog = true" color="success">Adicionar</v-btn>
        <task-form @saved="taskSaved()" v-model="task" :dialog.sync="dialog"/>
    </div>
</template>

<script lang="ts">
import { ITask } from '@/types'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'
import {
    TaskService
} from '@/services'
import TaskForm from '@/forms/TaskForm.vue'

@Component({
    name: 'TaskView',
    components: {
        TaskForm
    }
})
export default class TaskView extends Vue {

    taskService = new TaskService()

    searchDesc = ''
    items: ITask[] = []
    dialog = false
    task: ITask = { } as ITask
    headers: DataTableHeader<ITask>[] = [
        {
            text: 'Descrição',
            value: 'desc'
        },
        {
            text: 'Preço',
            value: 'price'
        },
        {
            text: 'Ações',
            value: 'actions',
            width: '100px'
        }
    ]

    onEdit(row: ITask) {
        this.task = { ...row}
        this.dialog = true
    }

    @Watch('searchName', {
        immediate: true
    })
    async searchNameChange() {
        await this.getDataFromApi()
    }

    async taskSaved() {
        await this.getDataFromApi()
    }

    async getDataFromApi() {
        const data = await this.taskService.findAll({desc: this.searchDesc})
        console.log(data)
        this.items = data
    }
}
</script>
