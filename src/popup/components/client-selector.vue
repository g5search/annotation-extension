<template>
  <b-container fluid class="px-0">
    <b-row>
      <b-col cols="8" offset="2">
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import HubHelpers from '../router/hub-helpers'
export default {
   components: {
    VueMultiselect
  },
  mixins: [HubHelpers],
  data() {
    return {
      client: null,
      location: null
    }
  },
  computed: {
     clients() {
      return this.$store.getters.clients
    },
    // TODO something off here, I am having to traverse payload
    locations() {
      return this.$store.getters.locations.payload
    }
  }
}
</script>

<style>

</style>
