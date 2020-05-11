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

function refetchRequired() {
  // in epoch, current - store.lastupdated > 10000, call get clients.
}

async function getClients(token) {
  const clients = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients`,
    headers
  })
  await store.dispatch('setClients', clients.data)
  return clients.data
}

async function getLocations(urn) {
  const locations = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients/${urn}/locations`,
    headers
  })
  return locations.data.filter(l => l.status !== 'Deleted')
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
    const { value } = req.data
    const locations = await getLocations(value)
    store.dispatch('setLocations', locations)
  } else if (req.msg === 'login') {
    onLog(req)
    const { email } = req
    getApiKey(email)
  } else if (req.msg === 'createDraft') {
    onLog(req.data)
    store.dispatch('createDraft', req.data)
  } else if (req.msg === 'createNote') {
    console.log({ req })
    createNote(req.data)
  }
  // chrome.runtime.sendMessage({ req, sender, res })
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
  console.table(table.data)
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
