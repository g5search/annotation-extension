import axios from 'axios'
// import store from './store'

// const opex = 'https://opex.g5marketingcloud.com'
const logColor = 'color: #e8513e;'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('%c 🧶 onInstalled', logColor)
  const clients = await getClients()
  chrome.storage.local.set({ clients: clients.slice(0, 200) }, () => {
    console.log('%c 🧶 "clients" set', logColor)
  })
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log('%c 🧶 onMessage', logColor)
  if (req === 'get-locations') {
    console.log({ req, sender, res })
    chrome.storage.local.get('urn', async (data) => {
      const locations = await getLocations(data.urn)
      chrome.storage.local.set({ locations })
      res('done')
    })
  }
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

async function getLocations(urn) {
  const locations = await axios({
    method: 'GET',
    url: `http://localhost:9541/api/extension/locations?client_urn=${urn}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': ''
    }
  })
  return locations
}
