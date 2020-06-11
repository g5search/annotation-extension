export const clients = (state) => state.clients
export const selectedClient = (state) => state.selectedClient
export const locations = (state) => state.locations
export const selectedLocations = (state) => state.selectedLocations
export const lastUpdated = (state) => state.lastUpdated
export const drafts = (state) => state.drafts
export const user = (state) => state.user
export const hasToken = (state) => state.user.hasToken

// export default {
//   clients(state) {
//     return state.clients
//   },
//   selectedClient(state) {
//     return state.selectedClient
//   },
//   locations(state) {
//     return state.locations
//   },
//   selectedLocations(state) {
//     return state.selectedLocations
//   },
//   lastUpdated(state) {
//     return state.lastUpdated
//   },
//   hasToken(state) {
//     return state.hasToken
//   }
// }
