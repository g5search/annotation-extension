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
      // 'selectedClient',
      'locations',
      'selectedLocations',
      'isInternal',
      'category',
      'actionType',
      'annotation',
      'lastUpdated',
      'user'
    ],
    loggerLevel: 'debug'
  })],
  state: {
    clients: [],
    selectedClient: null,
    locations: [],
    selectedLocations: [],
    lastUpdated: '',
    isInternal: true,
    category: null,
    actionType: null,
    startDate: null,
    endDate: null,
    annotation: {
      html: '',
      json: null
    },
    user: {
      hasToken: false
    }
  },
  getters,
  mutations,
  actions
})
