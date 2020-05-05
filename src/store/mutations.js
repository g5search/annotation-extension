import * as types from './mutation-types'

export default {
  [types.GET_CLIENTS] (state, payload) {
    state.clients = payload
  },
  [types.GET_LOCATIONS] (state, payload) {
    state.locations = payload
  },
  [types.UPDATE_DRAFT] (state, payload) {
    const i = state.drafts.findIndex(draft => draft.id === payload.id)
    state.drafts[i] = payload
  },
  [types.CREATE_DRAFT] (state, payload) {
    state.drafts.push(payload)
  },
  [types.DROP_DRAFT] (state, payload) {
    const i = state.drafts.findIndex(draft => draft.id === payload.id)
    state.drafts.splice(i, 1)
  }
}
