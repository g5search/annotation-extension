import * as types from './mutation-types'

export const getClients = ({ commit }, payload) => {
  commit(types.GET_CLIENTS, payload)
}

export const setClient = async ({ commit }, payload) => {
  await commit(types.UPDATE_DRAFT, payload)
  chrome.runtime.sendMessage('fetchLocations')
}

export const createDraft = ({ commit }, payload) => {
  console.log({ payload })
  commit(types.CREATE_DRAFT, payload)
}
