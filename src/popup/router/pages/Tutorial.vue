<template>
  <b-container fluid class="px-0">
    <b-row>
      <b-col>
        <b-card>
          <b-btn @click="viewOptions">
            <b-icon-option />
          </b-btn>
           <b-btn @click="getClients">
            <b-icon-forward />
            Start Workflow
          </b-btn>
          <b-btn @click="getStorage">
            Load Current
          </b-btn>
        </b-card>
      </b-col>
    </b-row>
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
            v-show="clients.length > 0"
            label="Location"
          >
            <vue-multiselect
              v-model="location"
              :options="locations"
              :custom-label="getLocationContext"
            />
          </b-form-group>
          <b-card-footer>
            <b-input-group>
              <b-form-select
                v-model="key"
                :options="keys"
              />
              <template v-slot:append>
                <b-btn @click="getByKey(key)" variant="outline-secondary">
                  Get Selected
                </b-btn>
                <b-btn @click="removeByKey(key)" variant="tertiary" class="roman">
                  Drop Selected
                </b-btn>
                <b-btn @click="clearStorage" variant="tertiary" class="roman">
                  Clear All Storage
                </b-btn>
              </template>
            </b-input-group>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      {{ storage }}
    </b-row>
  </b-container>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import Helpers from '../mixin'
export default {
  components: {
    VueMultiselect
  },
  mixins: [Helpers],
  data() {
    return {
      client: null,
      clients: [],
      location: null,
      locations: [],
      storage: [],
      key: 'clients',
      keys: ['clients', 'locations']
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
        this.clients = data.clients
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
