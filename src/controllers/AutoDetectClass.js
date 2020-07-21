import { onAuthedReq, updateUi, getLocations, getClientFromUrn } from '../background'
import { pageMap } from '../config/pageDetection'

/**
 * Class auto populates client and location in extensions ui
 * based on the page the user is on
 * @class AutoDetecter
 */
class AutoDetecter {
  /**
   *Creates an instance of AutoDetecter.
   * @param {string} url -  url of page user is on
   * @param {function} cb - callback funtion to res chrome msg
   */
  constructor(url, cb, manual = false) {
    this.url = url
    this.manual = manual
    this.cb = cb
    this.pageMap = pageMap
  }

  fromUrl(regexStr, data) {
    const id = this.url.match(new RegExp(regexStr))[data.group]
    const endpoint = `${data.host}${id}`
    onAuthedReq(endpoint, this.cb, data.selectLocation)
  }

  injected(regexStr, data) {
    chrome.tabs.executeScript({
      file: data.file
    })
    this.cb({ status: 200 })
  }

  async populateClientAndLoc(regexStr, data) {
    const [, clientUrn, locationUrn] = this.url.match(new RegExp(regexStr))
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(clientUrn)
    const selectedLocations = locations.filter(l => l.urn === locationUrn)
    this.cb({ client, locations, selectedLocations })
    updateUi({ client, locations, selectedLocations })
  }

  async populateClient(regexStr, data) {
    const [, clientUrn] = this.url.match(new RegExp(regexStr))
    const client = await getClientFromUrn(clientUrn)
    const locations = await getLocations(client.urn)
    this.cb({ client, locations })
    updateUi({ client, locations })
  }

  detect() {
    const matchVal = Object.entries(this.pageMap).filter(([key, val]) => {
      const reg = new RegExp(key);
      return reg.test(this.url)
    })
    if (matchVal.length > 0) {
      const [[regex, data]] = matchVal
      this[data.functionName](regex, data)
    } else {
      this.manual ? chrome.tabs.executeScript({file: './content-scripts/clw.js'})
        : this.cb({ status: 200 })
    }
  }
}

export {
  AutoDetecter
}