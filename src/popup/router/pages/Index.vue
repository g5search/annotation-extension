<template>
  <b-container fluid class="p-3">
    <b-row>
      <b-col>
        <b-card header="A header" class="border">
          {{ msg }}
          <code lang="json" class="d-block text-tertiary">
            {{ all }}
            {{ url }}
          </code>
          <b-form>
            <b-form-group
              label="Client"
            >
              <b-form-select
                id="client-select"
                v-model="client"
                :options="clients"
              />
            </b-form-group>
          </b-form>
          <template v-slot:footer>
            <b-btn @click="getClients">
              Get Clients
            </b-btn>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import pkg from '../../../../package.json'
export default {
  data () {
    return {
      msg: pkg.version,
      client: null,
      clients: [],
      url: null
    }
  },
  computed: {
    all() {
      return this.$store.state
    }
  },
  created() {
    this.url = chrome.runtime.getURL()
  },
  methods: {
    getClients() {
      chrome.storage.sync.get('color', (data) => {
        this.msg = `Storage Color: ${data.color}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
