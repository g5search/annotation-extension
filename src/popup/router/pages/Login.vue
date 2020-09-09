<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card class="my-2">
          <template v-slot:header>
            <h1>
              We need your getg5.com email
            </h1>
            <p>
              You should only have to do this once.
            </p>
          </template>
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
          <b-btn-group class="w-100">
            <b-btn
              :disabled="!isEmail"
              :variant="isSuccess ? 'success' : 'secondary'"
              @click="fetchToken"
            >
              Fetch Token
            </b-btn>
            <!-- <b-btn
              id="invalid-token"
              :disabled="!isEmail"
              @click="invalidateToken"
              variant="outline-tertiary"
            >
              <b-icon-trash />
              Remove All Tokens
            </b-btn> -->
          </b-btn-group>
          <b-tooltip
            target="invalid-token"
            triggers="hover"
            variant="tertiary"
            placement="top"
          >
            Use this option to clear all existing API tokens for your email address.
          </b-tooltip>
          <template v-slot:footer>
            {{ hasToken ? 'Token Installed.' : 'Please fetch a new Token.' }}
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card class="my-2">
          <template v-slot:header>
            <h2>
              Also, you can toggle your default team.
            </h2>
          </template>
          <b-form-checkbox
            v-model="isDa"
            switch
            @change="updateTeam"
            class="text-secondary"
          >
            {{ isTeam }}
          </b-form-checkbox>
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
      isSuccess: false,
      isDa: true
    }
  },
  computed: {
    isTeam() {
      return this.isDa ? 'Digital Advertising' : 'SEO'
    },
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
    chrome.storage.sync.get('team', (res) => {
      const { team } = res
      if (team) {
        this.$store.dispatch('setTeam', team)
        if (team === 'da') {
          this.isDa = true
        } else {
          this.isDa = false
        }
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
    updateTeam(val) {
      chrome.runtime.sendMessage({
        msg: 'set-team',
        data: val ? 'da' : 'seo'
      })
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
