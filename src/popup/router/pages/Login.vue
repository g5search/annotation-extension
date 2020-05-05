<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card>
          <b-form-group
            label="We need your email"
          >
            <b-form-input
              id="email-input"
              :value="email"
              @input="updateEmail"
              type="email"
            />
          </b-form-group>
          <b-btn @click="getId">Id</b-btn>
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
      return true
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
