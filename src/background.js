import axios from 'axios'
import store from './store'

const opex = 'https://opex.g5marketingcloud.com'

export default {
  computed: store,
  async getClients() {
    const clients = await axios.get(`${opex}/api/clients`)
    return clients.map(c => c.data)
  },
  async getLocations(clientUrn) {
    const locations = await axios.get(`${opex}/api/hub/${clientUrn}/locations`)
    return locations.map(l => l.data)
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#e8513e' }, () => {
    console.log('%c 🧶 Background.js loaded!', 'color: #e8513e;')
  })
})
