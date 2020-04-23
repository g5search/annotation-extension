import axios from 'axios'
// import store from './store'

const opex = 'http://localhost:9541'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('%c 🧶 onInstalled', 'color: #e8513e;')
  const clients = await getClients()
  console.log({ clients })
  chrome.storage.sync.set({ color: '#e8513e' }, () => {
    console.log('%c 🧶 Storage Sync Set', 'color: #e8513e;')
  })
})

chrome.runtime.onConnect.addListener((port) => {
  console.log('%c 🧶 onConnect', 'color: #e8513e;')
  console.log({ port })
  port.onMessage.addListener((msg) => {
    console.log({ msg })
    port.postMessage('received')
  })
})

async function getClients() {
  const clients = await axios.get(`${opex}/api/clients?seo_active=false`).catch(err => err)
  return clients.map(c => c.data)
}

async function getLocations(clientUrn) {
  const locations = await axios.get(`${opex}/api/hub/${clientUrn}/locations`)
  return locations.map(l => l.data)
}
