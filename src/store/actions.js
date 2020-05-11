import * as types from './mutation-types'

export const setClients = ({ commit }, clients) => {
  commit(types.SET_CLIENTS, clients)
}

export const setClient = async ({ commit }, { payload }) => {
  await commit(types.UPDATE_DRAFT, payload)
}

export const setLocations = async ({ commit }, payload) => {
  await commit(types.SET_LOCATIONS, payload)
}

export const hasToken = ({ commit }) => {
  commit(types.HAS_TOKEN, true)
}

export const createDraft = ({ commit }, payload) => {
  commit(types.CREATE_DRAFT, payload)
}

export const updateDraft = ({ commit }, updates) => {
  commit(types.UPDATE_DRAFT, updates)
}

export const dropDraft = ({ commit }, index) => {
  console.log('DROPPED')
  commit(types.DROP_DRAFT, index)
}
