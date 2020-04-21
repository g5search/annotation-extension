import * as types from './mutation-types'

export const setClient = ({ commit }, payload) => {
  commit(types.SET_CLIENT, payload)
}
