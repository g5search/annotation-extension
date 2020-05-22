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

chrome.runtime.onInstalled.addListener(async () => {
  autoDetectClientLocation()
  const clients = await getClients()
  store.dispatch('setClients', clients)
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
    const locations = await getLocations(req.data.value)
    store.dispatch('setLocations', locations)
    res(200)
  } else if (req.msg === 'login') {
    const key = await getApiKey(req.email)
    chrome.storage.sync.set({ apiKey: key }, async () => {
      await store.dispatch('hasToken')
      res(201)
    })
  } else if (req.msg === 'reload-clients') {
    // ALT XHR FOR CLIENTS keep for now
    getXHRClients(res)
  } else if (req.msg === 'createNote') {
    createNote(req.data)
    res(201)
  }
}

async function getClients() {
  const clients = await axios({
    method: 'GET',
    url: `${host}/api/hub/clients?activeDa=true`,
    headers
  })
  return clients.data
}

function getXHRClients(cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${host}/api/hub/clients?activeDa=true`, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send()
  xhr.onload = () => {
    console.log('%c onload event fired.', 'color: red;')
    const clients = JSON.parse(xhr.responseText)
    console.log(clients.length)
    store.dispatch('setClients', clients)
    cb(200)
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

function createNote(annotation) {
  chrome.storage.sync.get('apiKey', (res) => {
    axios.post(`${host}/api/v1/note?key=${res.apiKey}`, annotation)
  })
}
function autoDetectClientLocation () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const url = tabs[0].url
    if (/https:\/\/www.g5search.com\/admin\/services\?id=(\d*)$/.test(url)) {
      // if the website is g5 search and it includes ?id for the client id
      const regex = /https:\/\/www.g5search.com\/admin\/services\?id=(\d*)$/
      const locationId = url.match(regex)
      const endpoint = `https://notes.g5marketingcloud.com/api/core/location/${locationId}`
  
    } else if (/https:\/\/www.g5search.com\/admin\/services\/details\/(\d*)\/(\d*)$/.test(url)) {
      // if the url constains g5search and includes the client and location id
      const regex = /https:\/\/www.g5search.com\/admin\/services\/details\/(\d*)\/(\d*)$/
      const [clientId, locationId] = url.match(regex)
      const endpoint = `https://notes.g5marketingcloud.com/api/core/location/${locationId}`
    }
    // else if () {
    //   // if in the service view pull the service id from url 
    //   const regex = /https:\/\/www.g5search.com\/admin\/services\/edit\/(\d*)$/
    //   const serviceId = url.match(regex)
    //   const endpoint = `https://notes.g5marketingcloud.com/api/core/location/${locationId}`
    // } 
    else if (/https:\/\/www.g5search.com\/admin\/clients\/(\d*)\/edit\?class=admin/.test(url)) {
      const regex = /https:\/\/www.g5search.com\/admin\/clients\/(\d*)\/edit\?class=admin/
      const clientId = url.match(regex)
      const endpoint = `https://notes.g5marketingcloud.com/api/core/client/${clientId}`
    } else if (/https:\/\/www.g5search.com\/admin\/clients\/edit_store\?id=(\d*)$/.test(url)) {
      const regex = /https:\/\/www.g5search.com\/admin\/clients\/edit_store\?id=(\d*)$/
      const locationId = url.match(regex)
      const endpoint = `https://notes.g5marketingcloud.com/api/core/location/${locationId}`
    } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)/.test(url)) {
      const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)/
      const clientId = url.match(regex)
      const endpoint = `https://notes.g5marketingcloud.com/api/core/client/${clientId}`
    } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations$/.test(url)) {
      const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations$/
      const clientUrn = url.match(regex)
      // set client Urn
    } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/edit$/.test(url)) {
      const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/edit$/
      const [clientUrn, locationUrn] = url.match(regex)
      // set client and location Urn
    } else if (/https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations/.test(url)) {
      const regex = /https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations/
      const clientUrn = url.match(regex)
      // set Client Urn
    } else if (/https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/pooling_location_phone_numbers/.test(url)) {
      const regex = /https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/pooling_location_phone_numbers/
      const [clientUrn, locationUrn] = url.match(regex)
      // set client and location Urn
    }
  })
}