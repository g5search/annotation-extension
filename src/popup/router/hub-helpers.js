export default {
  methods: {
    getClientContext({ name, brandedName, urn }) {
      return `${(brandedName === '' || brandedName === null) ? name : brandedName} - [${urn}]`
    },
    getClientName({ name, brandedName }) {
      return `${name}`
      // return `${(brandedName === '' || brandedName === null) ? name : brandedName}`
    },
    getLocationName({ name, displayName }) {
      return `${(displayName === null || displayName === '') ? name : displayName}`
    }
  }
}
