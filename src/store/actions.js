import * as types from './mutation-types'

export const getClients = ({ commit }, payload) => {
  commit(types.GET_CLIENTS, payload)
}

export const createDraft = ({ commit }, payload) => {
  commit(types.CREATE_DRAFT, payload)
}
