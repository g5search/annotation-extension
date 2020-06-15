import axios from 'axios'
import store from './store'

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
    const locations = await getLocations(req.data.value)
    // store.dispatch('setLocations', locations)
    res({ locations })
  } else if (req.msg === 'login') {
    const key = await getApiKey(req.email)
    chrome.storage.sync.set({ apiKey: key }, async () => {
      await store.dispatch('hasToken')
      res(201)
    })
  } else if (req.msg === 'reload-clients') {
    // ALT XHR FOR CLIENTS keep for now
    getXHRClients(res)
  } else if (req.msg === 'create-note') {
    createNote(req.data)
    res(201)
  } else if (req.msg === 'auto-detect') {
    await autoDetectClientLocation(req.url, res)
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

async function getClientFromUrn(urn) {
  // console.log({ urn })
  const clients = store.getters.clients
  const client = clients.filter(client => client.urn == urn)
  return client[0]
}

/**
 * Appends network request with user's apiKey, then blends response with props into callback
 * @param {String} endpoint
 * @param {Function} cb
 * @param  {...any} props
 */
function onAuthedReq(endpoint, cb, ...props) {
  chrome.storage.sync.get('apiKey', async (res) => {
    const { data } = await axios({
      method: 'GET',
      url: `${endpoint}?key=${res.apiKey}`,
      headers
    })
    cb({ ...data, ...props })
  })
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
  console.log({ urn })
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

async function autoDetectClientLocation(url, cb) {
  if (/https:\/\/www.g5search.com\/admin\/services\?id=(\d*)$/.test(url)) {
    const regex = /https:\/\/www.g5search.com\/admin\/services\?id=(\d*)$/
    const [, locationId] = url.match(regex)
    const endpoint = `${host}/api/core/location/${locationId}`
    onAuthedReq(endpoint, cb)

  } else if (/https:\/\/www.g5search.com\/admin\/services\/details\/(\d*)\/(\d*)$/.test(url)) {
    const regex = /https:\/\/www.g5search.com\/admin\/services\/details\/(\d*)\/(\d*)$/
    const [, clientId, locationId] = url.match(regex)
    const endpoint = `${host}/api/core/location/${locationId}`
    onAuthedReq(endpoint, cb, clientId)

  } else if (/https:\/\/www.g5search.com\/admin\/services\/edit\/(\d*)$/.test(url)) {
    const regex = /https:\/\/www.g5search.com\/admin\/services\/edit\/(\d*)$/
    const serviceId = url.match(regex)
    const endpoint = `https://notes.g5marketingcloud.com/api/core/services/${serviceId}`
    onAuthedReq(endpoint, cb)

  } else if (/https:\/\/www.g5search.com\/admin\/clients\/(\d*)\/edit\?class=admin/.test(url)) {
    const regex = /https:\/\/www.g5search.com\/admin\/clients\/(\d*)\/edit\?class=admin/
    const [, clientId] = url.match(regex)
    const endpoint = `${host}/api/core/client/${clientId}`
    onAuthedReq(endpoint, cb)

  } else if (/https:\/\/www.g5search.com\/admin\/clients\/edit_store\?id=(\d*)$/.test(url)) {
    const regex = /https:\/\/www.g5search.com\/admin\/clients\/edit_store\?id=(\d*)$/
    const [, locationId] = url.match(regex)
    const endpoint = `${host}/api/core/location/${locationId}`
    onAuthedReq(endpoint, cb)

  } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/edit$/.test(url)) {
    const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/edit$/
    const [, clientUrn, locationUrn] = url.match(regex)
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(clientUrn)
    const selectedLocations = locations.filter(l => l.urn === locationUrn)
    cb({ client, locations, selectedLocations })

  } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations$/.test(url)) {
    const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations$/
    const [, clientUrn] = url.match(regex)
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(client.urn)
    const selectedLocations = locations.filter(l => l.urn === locationUrn)
    cb({ client, locations, selectedLocations })

  } else if (/https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)$/.test(url)) {
    const regex = /https:\/\/hub\.g5marketingcloud\.com\/admin\/clients\/(\S*)/
    const [, clientUrn] = url.match(regex)
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(client.urn)
    cb({ client, locations })

  } else if (/https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations/.test(url)) {
    const regex = /https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations/
    const [, clientUrn] = url.match(regex)
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(client.urn)
    const selectedLocations = locations.filter(l => l.urn === locationUrn)
    cb({ client, locations, selectedLocations })

  } else if (/https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/pooling_location_phone_numbers/.test(url)) {
    const regex = /https:\/\/call-tracking\.g5marketingcloud\.com\/admin\/clients\/(\S*)\/locations\/(\S*)\/pooling_location_phone_numbers/
    const [, clientUrn, locationUrn] = url.match(regex)
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(client.urn)
    const selectedLocations = locations.filter(l => l.urn === locationUrn)
    cb({ client, selectedLocations, locations })

  } else if (/https\:\/\/ui\.ads\.microsoft\.com\/campaign\/Campaigns\?\S*#customer\/\S*\/account\/(\d*)\/overview/.test(url)) {
    const regex = /https\:\/\/ui\.ads\.microsoft\.com\/campaign\/Campaigns\?\S*#customer\/\S*\/account\/(\d*)\/overview/
    const [, code_account] = url.match(regex)

  } else if (/ https:\/\/business\.facebook\.com\/adsmanager\/manage\/all\?\S*act=(\d*)\S*/.test(url)) {
    const regex =  /https:\/\/business\.facebook\.com\/adsmanager\/manage\/all\?\S*act=(\d*)\S*/
    const accountId = url.match(regex)

  } else if (/https:\/\/business\.facebook\.com\/adsmanager\/manage\/all\?\S*selected_campaign_ids=(\d*)&root_level=ad_set/.test(url)) {
    const regex = /https:\/\/business\.facebook\.com\/adsmanager\/manage\/all\?\S*selected_campaign_ids=(\d*)&root_level=ad_set/
    const campaignId = url.match(regex)

  } else {
    cb({ status: 200 })
  }
}
