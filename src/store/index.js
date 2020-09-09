import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [new VuexWebExtensions({
    persistentStates: [
      'clients',
      'isInternal',
      'category',
      'actionType',
      'annotation',
      'lastUpdated',
      'user',
      'team'
    ],
    // loggerLevel: 'debug'
  })],
  state: {
    clients: [],
    locations: [],
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
    team: 'da',
    user: {
      hasToken: false
    }
  },
  getters,
  mutations,
  actions
})
