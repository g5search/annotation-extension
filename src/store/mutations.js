import * as types from './mutation-types'

export default {
  [types.SET_CLIENT] (state, payload) {
    state.client = payload
  }
}
