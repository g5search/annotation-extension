import axios from 'axios'
import store from './store'

const logColor = 'color: #e8513e;'

const client = mapState()
console.log({ store })

chrome.contextMenus.onClicked.addListener(onClick)

chrome.runtime.onInstalled.addListener(async () => {
  console.log('%c 🧶 onInstalled', logColor)
  const contexts = [
    'page',
    'selection',
    'link',
    'editable'
  ]
  contexts.forEach((context) => {
    const id = chrome.contextMenus.create({
      title: context,
      contexts: [context],
      id: `context-${context}`
    })
    onLog(`Context Menu, ${id}, installed`)
  })
  createContextMenus()
  const clients = await getClients()
  store.dispatch('getClients', clients)
  chrome.storage.local.set({ clients: clients.slice(0, 200) })
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  // onLog(req)
  if (req === 'get-locations') {
    chrome.storage.local.get('urn', async (data) => {
      const locations = await getLocations(data.urn)
      chrome.storage.local.set({ locations })
      res('done')
    })
  }
})

// TODO Not sure this is how vuex in this context
function mapState() {
  return {
    client() {
      return store.state.client()
    }
  }
}

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

// TODO use to enable features on page
function createContextMenus() {
  const id = chrome.contextMenus.create({
    title: 'checkbox',
    type: 'checkbox',
    id: 'checkbox-1'
  })
  onLog(id)
}

function onLog(msg) {
  typeof msg === 'string'
    ? console.log(`%c 🧶 ${msg}`, logColor)
    : console.log(msg)
}

function onClick(context, tab) {
  onLog(tab.url)
  const table = Object.keys(context).map((key) => {
    return [
      key,
      context[key]
    ]
  })
  console.table(table)
}
