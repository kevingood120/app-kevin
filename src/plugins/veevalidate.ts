import Vue from 'vue'
import { required, email, length } from "vee-validate/dist/rules";
import {
  ValidationObserver,
  extend
} from 'vee-validate'
import { CustomerService } from '@/services';


extend("required", {
  ...required,
  message: "Requerido"
});

extend("email", {
  ...email,
  message: "Email inválido"
});

extend('length', {
    ...length,
    message: 'Somente {length} caractéres'
})




Vue.component('validation-observer', ValidationObserver)