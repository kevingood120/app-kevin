import Vue from 'vue'
import { required, email, length, regex, alpha, max } from "vee-validate/dist/rules";
import {
  ValidationObserver,
  extend
} from 'vee-validate'
import Service from '@/services/Service';


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

extend('alpha', {
  ...alpha,
  message: 'Somente alfanuméricos'
})

extend('regex', {
  ...regex
})
extend('max', {
  ...max,
  message: 'Máximo {length} caractéres'
})

extend('unique', {
  params: ['service', 'field', 'id'],
  async validate(value, params) {
    const { service, field, id } = params as any

    const abstractService: Service<any> = service
    const found = await abstractService.findOne({
      [field]: value
    })

    return !(found && found.id !== id)
  },
  message: 'Já cadastrado'
})




Vue.component('validation-observer', ValidationObserver)