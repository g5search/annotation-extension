export default {
  methods: {
    getClientContext({ name, brandedName, urn }) {
      return `${(brandedName === '' || brandedName === null) ? name : brandedName} - [${urn}]`
    },
    getClientName({ name, brandedName }) {
      return `${(brandedName === '' || brandedName === null) ? name : brandedName}`
    },
    async getLocations(client) {
      this.$store.dispatch('setClient', client)
      const { urn } = client
      chrome.storage.local.set({ urn })
      chrome.runtime.sendMessage('locations', (res) => {
        console.log(res)
      })
    },
    getLocationName(location) {
      return `${location.name}`
    },
    getLocationContext({ name, displayName, offPlatform }) {
      return `${(displayName === null || displayName === '') ? name : displayName} ${offPlatform === 'true' ? '[Off-Platform]' : ''}`
    }
  }
}
