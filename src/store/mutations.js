import * as types from './mutation-types'

export default {
  [types.HAS_TOKEN] (state, payload) {
    state.user.hasToken = payload
  },
  [types.SET_CLIENTS] (state, payload) {
    console.log(payload.length)
    state.clients = payload
  },
  [types.SET_LAST_UPDATED] (state) {
    state.lastUpdated = new Date.now()
  },
  [types.SET_LOCATIONS] (state, payload) {
    state.locations = payload.payload
  },
  [types.UPDATE_DRAFT] (state, payload) {
    const i = state.drafts.findIndex(draft => draft.id === payload.id)
    state.drafts[i][payload.prop] = payload.value
  },
  [types.CREATE_DRAFT] (state, payload) {
    state.drafts.push(payload)
  },
  [types.DROP_DRAFT] (state, payload) {
    const i = state.drafts.findIndex(draft => draft.id === payload.id)
    state.drafts.splice(i, 1)
  }
}
