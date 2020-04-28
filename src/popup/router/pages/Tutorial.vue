<template>
  <b-container fluid class="px-0">
    <b-row>
      <b-col>
        <b-card
          header="Hub Selector via Local Storage"
        >
          <b-form-group
            v-show="clients.length > 0"
            label="Client"
            class="my-3"
          >
            <vue-multiselect
              v-model="client"
              :options="clients"
              :custom-label="getClientName"
              @input="getLocations"
              track-by="urn"
              label="name"
            />
          </b-form-group>
          <b-form-group
            label="Location"
          >
            <vue-multiselect
              v-model="location"
              :options="locations"
              :custom-label="getLocationName"
            />
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import HubHelpers from '../hub-helpers'
export default {
  components: {
    VueMultiselect
  },
  mixins: [HubHelpers],
  data() {
    return {
      client: null,
      location: null,
      storage: [],
      key: 'clients',
      keys: ['clients', 'locations']
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    locations() {
      return this.$store.getters.locations.payload
    }
  },
  methods: {
    viewOptions() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage()
      } else {
        window.open(chrome.runtime.getURL('options.html'))
      }
    },
    getClients() {
      chrome.storage.local.get('clients', (data) => {
        // this.clients = data.clients
        chrome.storage.local.get('locations', (data) => {
          this.locations = data.locations.data
        })
      })

    },
    setByKeyVal(key, val) {
      chrome.storage.local.set(`${key}`)
      chrome.runtime.sendMessage(key, (res) => {
        console.log(res)
      })
    },
    getByKey(key) {
      chrome.runtime.sendMessage(key, () => {
        this.getStorageSync()
      })
    },
    getStorage() {
      chrome.storage.local.get((data) => {
        this.storage = data
      })
    },
    removeByKey(key) {
      if (!key) {
        this.getStorage()
      } else {
        chrome.storage.local.remove(key)
      }
    },
    clearStorage() {
      chrome.storage.local.clear(() => {
        this.storage = []
      })
    },
    setStorageSync(evt) {

    }
  }
}
</script>

<style>

</style>
