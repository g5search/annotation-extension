import axios from 'axios'
// import store from './store'

const opex = 'https://opex.g5marketingcloud.com'
const logColor = 'color: #e8513e;'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('%c 🧶 onInstalled', logColor)
  const clients = await getClients()
  chrome.storage.sync.set({ clients: clients.slice(0, 10) }, () => {
    console.log('%c 🧶 "clients" set', logColor)
  })
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log('%c 🧶 onMessage', logColor)
  console.log({ req, sender, res })
})

async function getClients() {
  const clients = await axios({
    method: 'GET',
    url: 'http://localhost:9541/api/extension/clients?seo_active=false',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': ''
    }
  })
  return clients.data
}

async function getLocations(clientUrn) {
  const locations = await axios.get(`${opex}/api/hub/${clientUrn}/locations`)
  return locations.map(l => l.data)
}
