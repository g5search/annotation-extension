export default {
  HAS_TOKEN(state, payload) {
    state.user.hasToken = payload
  },
  SET_CLIENTS(state, payload) {
    state.clients = payload
  },
  DROP_CLIENTS(state) {
    state.clients = []
  },
  SET_LAST_UPDATED(state) {
    state.lastUpdated = new Date.now()
  },
  SET_LOCATIONS(state, payload) {
    state.locations = payload.payload
  }
}
