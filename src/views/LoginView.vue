<template>
    <v-app>
        <v-container class="justify-center align-center d-flex">
            <v-card width="400px">
                <v-toolbar>
                    <v-toolbar-title>
                        Login
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <validation-observer>
                        <v-form>
                            <custom-text-field type="text" label="Email"/> 
                            <custom-text-field type="password" label="Senha"/> 
                            <v-btn color="success">Login</v-btn>
                        </v-form>
                    </validation-observer>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class LoginView extends Vue {

}
</script>

<style lang="scss" scoped>
    .container {
        height: 100vh;
    }
</style>