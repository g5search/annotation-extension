export default {
  HAS_TOKEN(state, payload) {
    state.user.hasToken = payload
  },
  SET_CLIENTS(state, payload) {
    state.clients = payload
  },
  SET_CLIENT(state, client) {
    state.client = client
  },
  DROP_CLIENTS(state) {
    state.clients = []
  },
  ON_RESET(state) {
    state.client = null
    state.selectedLocations = []
    state.category = null
    state.actionType = null
    state.annotation.html = ''
  },
  SET_LAST_UPDATED(state) {
    state.lastUpdated = new Date.now()
  },
  UPDATE_FIELD(state, keyVal) {
    const { key, value } = keyVal
    state[key] = value
  },
  SET_LOCATIONS(state, payload) {
    state.locations = payload.payload
  }
}
