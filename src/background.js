import axios from 'axios'
// import store from './store'

export default {
  async getClients() {
    const clients = await axios.get(updatablesApi.clients)
    return clients.map(c => c.data.urn)
  },
  async getLocations(clientUrn) {
    const locations = await axios.get(`${updatablesApi.locations}/${clientUrn}`)
    return locations.map(l => l.data)
  }
}
