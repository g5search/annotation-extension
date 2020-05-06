<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card class="my-2">
          <b-form-group
            label-class="text-secondary"
            description="Your getg5 email"
          >
            <template v-slot:label>
              <b-icon-envelope />
              Your Email
            </template>
            <b-form-input
              id="email-input"
              :value="email"
              @input="updateEmail"
              type="email"
            />
          </b-form-group>
          <b-btn
            :disabled="!isEmail"
            @click="getId"
            block
            pill
          >
            Fetch Token
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
      email: null
    }
  },
  computed: {
    isEmail() {
      return this.email === null
        ? null
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    }
  },
  methods: {
    getId() {
      chrome.identity.getProfileUserInfo(res => console.log({ res }))
    },
    updateEmail(evt) {
      console.log({ evt })
    }
  }
}
</script>

<style>

</style>
