import axios from 'axios'
// import store from './store'

const opex = 'http://localhost:9541'
const logColor = 'color: #e8513e;'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('%c 🧶 onInstalled', logColor)
  chrome.storage.sync.set({ counter: 1 }, () => {
    console.log('%c 🧶 "counter" set', logColor)
  })
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log('%c 🧶 onMessage', logColor)
  console.log({ req, sender, res })
})

async function getClients() {
  const clients = await axios.get(`${opex}/api/clients?seo_active=false`).catch(err => err)
  return clients.map(c => c.data)
}

async function getLocations(clientUrn) {
  const locations = await axios.get(`${opex}/api/hub/${clientUrn}/locations`)
  return locations.map(l => l.data)
}
