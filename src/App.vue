<template>
    <v-app>
        <v-navigation-drawer app v-model="drawer">
            <v-list flat>
                <div v-for="link in links" :key="link.to">
                    <v-list-item color="primary" link :to="link.to" v-if="!link.items">
                        <v-list-item-icon>
                            <v-icon v-text="link.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title v-text="link.title"></v-list-item-title>
                    </v-list-item>
                    <v-list-group color="primary" v-else no-action :prepend-icon="link.icon">
                        <template v-slot:activator>
                            <v-list-item-title v-text="link.title"></v-list-item-title>
                        </template>
                        <v-list-item
                            v-for="sublink in link.items"
                            :to="sublink.to"
                            :key="sublink.title"
                            link
                            color="primary"
                        >
                            <v-list-item-title v-text="sublink.title" />
                            <v-list-item-icon>
                                <v-icon v-text="sublink.icon"></v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list-group>
                </div>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar color="primary" app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Sistema</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { INavLink } from './types'

@Component({})
export default class App extends Vue {
    drawer = false
    links: INavLink[] = [
        {
            title: 'Cliente',
            to: '/customer',
            icon: 'fa-user',
        },
        {
            title: 'Produto',
            to: '/product',
            icon: 'fa-hdd'
        },
        {
            title: 'Endereço',
            to: '/address',
            icon: 'fas fa-map-marker-alt'
        },
        {
            title: 'Serviços',
            to: '/task',
            icon: 'fa-cog'
        }
    ]
}
</script>


<style lang="scss">

    .v-data-table {
        td {
            white-space: nowrap;
        }
    }

</style>