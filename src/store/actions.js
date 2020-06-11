export default {
  async resetNote({ commit }) {
    await commit('ON_RESET')
  },
  async dropClients({ commit }) {
    await commit('DROP_CLIENTS')
  },
  setClients({ commit }, clients) {
    if (clients.payload) {
      commit('SET_CLIENTS', clients.payload)
    } else {
      commit('SET_CLIENTS', clients)
    }
  },
  // setClient({ commit }, client) {
  //   if (client.payload) {
  //     commit('SET_CLIENT', client.payload)
  //   } else {
  //     commit('SET_CLIENT', client)
  //   }
  // },
  async setLocations({ commit }, payload) {
    await commit('SET_LOCATIONS', payload)
  },
  // async setSelectedLocations({ commit }, locations) {
  //   await commit('SET_SELECTED_LOCATIONS', locations)
  // },
  async updateField({ commit }, keyVal) {
    await commit('UPDATE_FIELD', keyVal)
  },
  async hasToken({ commit }) {
    await commit('HAS_TOKEN', true)
  },
  setLastUpdated({ commit }) {
    commit('SET_LAST_UPDATED')
  }
}
