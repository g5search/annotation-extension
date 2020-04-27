<template>
  <b-container fluid class="px-0">
    <b-row>
      <b-col>
        <b-card>
          <b-btn @click="viewOptions">
            View Extension Options Page
          </b-btn>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card header="All Chrome Extension Tutorial Content">
          <b-btn @click="getStorageSync">
            Get Clients from Storage Sync
          </b-btn>
          <b-form-group v-if="storage.length > 0" label="Client">
            <b-form-select
              v-model="client"
              :options="storage"
            />
          </b-form-group>
          <b-btn @click="setStorageSync">
            Set Storage
          </b-btn>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      client: null,
      storage: []
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
    getStorageSync() {
      chrome.storage.sync.get('clients', (data) => {
        this.storage = data.clients.map(client => ({
          text: client.name,
          value: client.urn
        }))
      })
    },
    setStorageSync(evt) {}
  }
}
</script>

<style>

</style>
