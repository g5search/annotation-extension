import axios from 'axios'
import store from './store'

// const host = 'https://notes.g5marketingcloud.com'
const host = 'http://localhost:4242'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': ''
}

// chrome.contextMenus.onClicked.addListener(onClick)

chrome.runtime.onInstalled.addListener(async () => {
  onLog('Installed')
  // createContextMenus()
  // TODO check for persistent store data before fetching update
  chrome.storage.sync.get('apiKey', (res) => {
    if (res) {
      store.dispatch('hasToken')
    }
    getClients()
  })
})

chrome.runtime.onMessage.addListener(onMessage)

async function getClients(token) {
  const clients = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients`,
    headers
  })
  await store.dispatch('getClients', clients.data)
  return clients.data
}

async function getLocations(urn) {
  const locations = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients/${urn}/locations`,
    headers
  })
  onLog(locations.data)
  // await store.dispatch('getLocations', locations.data)
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
  if (req.msg === 'locations') {
    // onLog(req)
    const { urn } = req
    const locations = await getLocations(urn)
    console.table(locations)
    store.dispatch('updateDraft', urn)
  } else if (req.msg === 'login') {
    onLog(req)
    const { email } = req
    getApiKey(email)
  } else if (req.msg === 'createNote') {
    createNote(req.data)
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

async function getApiKey(email) {
  const { data } = await axios({
    method: 'POST',
    url: `${host}/api/v1/key`,
    headers,
    data: { email }
  })
  chrome.storage.sync.set({ apiKey: data.key })
}

function createNote(annotation){
  chrome.storage.sync.get('apiKey', (res) => {
    const { apiKey } = res
    console.log({ apiKey })
    axios.post(`${host}/api/v1/note?key=${apiKey}`, { annotation })
  })
}
