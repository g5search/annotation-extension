import * as types from './mutation-types'

export default {
  [types.SET_CLIENT] (state, payload) {
    state.client = payload
  },
  [types.GET_CLIENTS] (state, payload) {
    state.clients = payload
  },
  [types.GET_LOCATIONS] (state, payload) {
    state.locations = payload
  },
  [types.SET_LOCATION] (state, payload) {
    state.location = payload
  }
}
