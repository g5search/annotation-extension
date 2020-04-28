import * as types from './mutation-types'

export const setClient = ({ commit }, payload) => {
  commit(types.SET_CLIENT, payload)
}

export const setLocation = ({ commit }, payload) => {
  commit(types.SET_LOCATION, payload)
}

export const getClients = ({ commit }, payload) => {
  // TODO api request here?
  commit(types.GET_CLIENTS, payload)
}

export const getLocations = ({ commit }, payload) => {
  // TODO api request here?
  commit(types.GET_LOCATIONS, payload)
}
