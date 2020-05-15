export const setLastUpdated = ({ commit }) => {
  commit('SET_LAST_UPDATED')
}

export const setClients = async ({ commit }, clients) => {
  await commit('SET_CLIENTS', clients)
}

export const setClient = async ({ commit }, { payload }) => {
  await commit('UPDATE_DRAFT', payload)
}

export const dropClients = async ({ commit }) => {
  await commit('DROP_CLIENTS')
}

export const setLocations = async ({ commit }, payload) => {
  await commit('SET_LOCATIONS', payload)
}

export const hasToken = async ({ commit }) => {
  await commit('HAS_TOKEN', true)
}
