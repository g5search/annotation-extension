import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import routes from './routes'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

export default new VueRouter({
  routes
})
