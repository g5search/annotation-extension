import axios from 'axios'
import store from './store'

const host = 'https://notes.g5marketingcloud.com'
// const host = 'http://localhost:4242'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': ''
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('apiKey', (res) => {
    if (res.apiKey) {
      store.dispatch('hasToken')
      getClients(res.apiKey)
    }
  })
})

chrome.runtime.onMessage.addListener(onMessage)

async function onMessage(req, sender, res) {
  if (req.msg === 'locations') {
    const locations = await getLocations(req.data.value)
    store.dispatch('setLocations', locations)
  } else if (req.msg === 'login') {
    getApiKey(req.email)
  } else if (req.msg === 'createDraft') {
    store.dispatch('createDraft', req.data)
  } else if (req.msg === 'createNote') {
    createNote(req.data)
    res(201)
  }
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

async function getApiKey(email) {
  const { data } = await axios({
    method: 'POST',
    url: `${host}/api/v1/key`,
    headers,
    data: { email }
  })
  chrome.storage.sync.set({ apiKey: data.key })
}

function createNote(annotation) {
  chrome.storage.sync.get('apiKey', (res) => {
    axios.post(`${host}/api/v1/note?key=${res.apiKey}`, annotation)
  })
}
