import * as types from './mutation-types'

export const getClients = ({ commit }, payload) => {
  commit(types.GET_CLIENTS, payload)
}

export const setClient = async ({ commit }, payload) => {
  await commit(types.UPDATE_DRAFT, payload)
  chrome.runtime.sendMessage('fetchLocations')
}

export const hasToken = async ({ commit }) => {
  commit(types.HAS_TOKEN, true)
}

export const createDraft = ({ commit }, payload) => {
  // console.log({ payload })
  commit(types.CREATE_DRAFT, payload)
}
