import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [new VuexWebExtensions({
    persistentStates: [
      'clients',
      'drafts',
      'lastUpdated',
      'user'
    ]
  })],
  state: {
    clients: [],
    drafts: [],
    locations: [],
    lastUpdated: '',
    user: {
      hasToken: false
    }
  },
  getters,
  mutations,
  actions
})
