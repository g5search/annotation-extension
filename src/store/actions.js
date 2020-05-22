// TODO this can probably be replaced by updateField
export const setLastUpdated = ({ commit }) => {
  commit('SET_LAST_UPDATED')
}

export const resetNote = async({ commit }) => {
  await commit('ON_RESET')
}

export const setClients = async ({ commit }, clients) => {
  if (clients.payload) {
    await commit('SET_CLIENTS', clients.payload)
  } else {
    await commit('SET_CLIENTS', clients)
  }
}

export const setClient = async ({ commit }, { payload }) => {
  await commit('SET_CLIENT', payload)
}

export const setLocations = async ({ commit }, payload) => {
  await commit('SET_LOCATIONS', payload)
}

export const setSelectedLocations = async ({ commit }, locations) => {
  await commit('SET_SELECTED_LOCATIONS', locations)
}

export const dropClients = async ({ commit }) => {
  await commit('DROP_CLIENTS')
}

export const updateField = async ({ commit }, keyVal) => {
  await commit('UPDATE_FIELD', keyVal)
}

// TODO this can probably be replaced by updateField
export const hasToken = async ({ commit }) => {
  await commit('HAS_TOKEN', true)
}
