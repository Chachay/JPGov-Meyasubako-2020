import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Vue.use(VueApexCharts)
Vue.component('Apexchart', VueApexCharts)

Vue.use(VueAxios, axios)

new Vue({ render: (h) => h(App) }).$mount('#app')
