import axios from 'axios'
import store from './store'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': ''
}

chrome.contextMenus.onClicked.addListener(onClick)

chrome.runtime.onInstalled.addListener(async () => {
  onLog('Installed')
  createContextMenus()
  // TODO check for persistent store data before fetching update
  chrome.storage.sync.get('key', (res) => {
    getClients(res.token)
  })
  // await getClients()
  // chrome.storage.local.set({ clients: clients.slice(0, 200) })
})

chrome.runtime.onMessage.addListener(onMessage)

async function getClients(token) {
  const clients = await axios({
    method: 'GET',
    // url: 'https://notes.g5marketingcloud.com/api/hub/clients',
    url: 'http://localhost:4242/api/hub/clients',
    headers
  })
  await store.dispatch('getClients', clients.data)
  return clients.data
}

async function getLocations(urn) {
  const locations = await axios({
    method: 'GET',
    // url: `https://notes.g5marketingcloud.com/api/hub/clients/${urn}/locations`,
    url: `http://localhost:4242/api/hub/clients/${urn}/locations`,
    headers
  })
  onLog(locations.data)
  await store.dispatch('getLocations', locations.data)
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
}

async function onLogin(email) {
  const token = await axios({
    method: 'GET',
    headers
  })
  return token
}

async function onMessage(req, sender, res) {
  onLog(req)
  if (req === 'locations') {
    const urn = store.state.client.urn
    onLog(urn)
    const locations = await getLocations(urn)
    // store.dispatch('getLocations', locations.data)
  } else if (req === 'login') {
    onLog(req)
    const email = store.state.user.email
    const token = onLogin(email)
    chrome.storage.sync.set({ key: token })
  }
  chrome.runtime.sendMessage({ req, sender, res })
}

function onLog(msg) {
  const logColor = 'color: #e8513e;'
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
