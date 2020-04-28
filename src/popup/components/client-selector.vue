<template>
  <b-container fluid class="px-0">
    <b-row no-gutters>
      <b-col>
        <b-form-group
          class="mb-1 text-secondary"
        >
          <template v-slot:label>
            <b-icon-briefcase />
            Client
          </template>
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
          class="mb-1 text-secondary"
        >
          <template v-slot:label>
            <b-icon-building />
            Location
          </template>
          <vue-multiselect
            v-show="locations"
            v-model="location"
            :options="locations"
            :custom-label="getLocationName"
            @input="setComplete"
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
    isComplete() {
      return this.client !== null && this.location !== null
    },
    clients() {
      return this.$store.getters.clients
    },
    // TODO something off here, I am having to traverse payload
    locations() {
      return this.$store.getters.locations.payload
    }
  },
  methods: {
    setComplete() {
      this.isComplete
        ? this.$emit('hub-ready')
        : this.$emit('error')
    }
  }
}
</script>

<style>

</style>
