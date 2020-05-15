<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card class="my-2">
          <b-form-group
            label-class="text-secondary"
            description="first.last@getg5.com"
          >
            <template v-slot:label>
              <b-icon-envelope />
              Your Email
            </template>
            <b-form-input
              id="email-input"
              :value="email"
              :state="isEmail"
              @input="updateEmail"
              type="email"
            />
          </b-form-group>
          <b-btn
            :disabled="!isEmail"
            :variant="isSuccess ? 'success' : 'secondary'"
            @click="fetchToken"
            block
          >
            Fetch Token
          </b-btn>
          <template v-slot:footer>
            {{ hasToken ? 'Token Installed.' : 'Please fetch a new Token.' }}
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      isSuccess: false
    }
  },
  computed: {
    isEmail() {
      return this.email === null
        ? null
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    },
    hasToken() {
      return this.$store.getters.hasToken
    }
  },
  mounted() {
    chrome.storage.sync.get('apiKey', (res) => {
      const { apiKey } = res
      if (apiKey) {
        this.isSuccess = true
        this.$store.dispatch('hasToken')
      }
    })
  },
  methods: {
    updateEmail(val) {
      this.email = val
    },
    onClear() {
      this.email = null
    },
    fetchToken() {
      chrome.runtime.sendMessage({
        msg: 'login',
        email: this.email
      }, () => {
        this.isSuccess = true
        this.onClear()
      })
    }
  }
}
</script>

<style>

</style>
