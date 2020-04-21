import axios from 'axios'
import store from './store'

export default {
  computed: store,
  async getClients() {
    const clients = await axios.get('')
    return clients.map(c => c.data.urn)
  },
  async getLocations(clientUrn) {
    const locations = await axios.get(`/${clientUrn}`)
    return locations.map(l => l.data)
  }
}
