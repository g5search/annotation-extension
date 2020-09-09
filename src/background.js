import axios from 'axios'
import store from './store'
import { AutoDetecter } from './controllers/AutoDetectClass'

const host = 'https://notes.g5marketingcloud.com'
// const host = 'http://localhost:3000'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': ''
}

chrome.runtime.onInstalled.addListener(async () => {
  const clients = await getClients()
  await store.dispatch('setClients', clients)
  chrome.storage.sync.get('apiKey', (res) => {
    if (res.apiKey) {
      store.dispatch('hasToken')
    } else {
      console.log('%c No apiKey Found!', 'color: red;')
    }
  })
})

chrome.runtime.onMessage.addListener(onMessage)

async function onMessage(req, sender, res) {
  if (req.msg === 'locations') {
    getXHRLocations(req.data.value, res)
  } else if (req.msg === 'login') {
    const key = await getApiKey(req.email)
    chrome.storage.sync.set({ apiKey: key }, async () => {
      await store.dispatch('hasToken')
      res(201)
    })
  } else if (req.msg === 'set-team') {
    chrome.storage.sync.set({ team: req.data }, async () => {
      await store.dispatch('setTeam', req.data)
      res(201)
    })
  } else if (req.msg === 'reload-clients') {
    getXHRClients(res)
  } else if (req.msg === 'create-note') {
    createNote(req.data)
    res(201)
  } else if (req.msg === 'auto-detect') {
    const { manual } = req
    const autoDetect = new AutoDetecter(req.url, res, manual)
    await autoDetect.detect()
  } else if (req.msg === 'core') {
    const clientId = req.data.clientId
    if (clientId) {
      const endpoint = `${host}/api/core/client/${clientId}`
      onAuthedReq(endpoint, updateUi)
    }
  } else if (req.msg === 'google-ads') {
    const accountId = req.data.customerId
      ? req.data.customerId.replace(/-/g, '')
      : req.data.codeAccount.replace(/-/g, '')
    const endpoint = `${host}/api/v1/google-ads/${accountId}`
    if (req.data.customerId) {
      onAuthedReq(endpoint, updateUi)
    } else {
      onAuthedReq(endpoint, updateUi, true)
    }
    res(201)
  } else if (req.msg === 'shape') {
    const { urn } = req.data
    if (urn.startsWith('g5-cl')) {
      const endpoint = `${host}/api/hub/location/${urn}`
      onAuthedReq(endpoint, updateUi, true)
    } else {
      const client = await getClientFromUrn(urn)
      const locations = await getLocations(urn)
      updateUi({ client, locations })
    }
    res(200)
  }
}

function updateUi(data) {
  chrome.runtime.sendMessage({
    msg: 'update-ui',
    data
  })
}

async function getClients() {
  const clients = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients?activeDa=false&internal=false`,
    headers
  })
  return clients.data
}

async function getClientFromUrn(urn) {
  const clients = store.getters.clients
  const client = clients.filter(client => client.urn == urn)
  return client[0]
}

function getXHRClients(cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${host}/api/hub/clients?activeDa=false&internal=false`, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send()
  xhr.onload = () => {
    const clients = JSON.parse(xhr.responseText)
    store.dispatch('setClients', clients)
    cb(200)
  }
}

function getXHRLocations(urn, cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${host}/api/hub/clients/${urn}/locations`, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send()
  xhr.onload = () => {
    const locations = JSON.parse(xhr.responseText)
    const filtered = locations.filter(l => l.status !== 'Deleted')
    cb({ locations: filtered })
    updateUi({ locations: filtered })
  }
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
  return data.key
}

/**
 * @param {String} endpoint
 * @param {Function} cb
 * @param {Boolean} includeLocations
 */
function onAuthedReq(endpoint, cb, includeLocations = false) {
  chrome.storage.sync.get('apiKey', async (res) => {
    if (!res.apiKey) {
      cb(404)
      return
    }
    const { data } = await axios({
      method: 'GET',
      url: `${endpoint}?key=${res.apiKey}`,
      headers
    })
    const client = await getClientFromUrn(data.clientUrn)
    const locations = await getLocations(client.urn)
    const { locationUrn } = data
    if (includeLocations) {
      const selectedLocations = locations.filter(l => l.urn === locationUrn)
      cb({ client, locations, selectedLocations })
      updateUi({ client, locations, selectedLocations })
    } else {
      cb({ client, locations })
      updateUi({ client, locations })
    }
  })
}

function createNote(annotation) {
  chrome.storage.sync.get('apiKey', (res) => {
    axios.post(`${host}/api/v1/note?key=${res.apiKey}`, annotation)
  })
}

export {
  onAuthedReq,
  updateUi,
  getLocations,
  getClientFromUrn
}
