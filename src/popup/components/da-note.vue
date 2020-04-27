<template>
  <b-card
    :bg-variant="isInternal ? 'quaternary-lt4' : 'white'"
    class="border-0 py-2 px-4"
    footer-class="p-0"
    footer-bg-variant="white"
    no-body
  >
    <text-area />
    <b-form-group>
      <b-form-select
        v-model="client"
        :options="clients"
      />
    </b-form-group>
    {{ client }}
    <b-form-checkbox
      v-model="isInternal"
      switch
      size="sm"
      class="my-3"
    >
      <b-icon-eye-fill v-if="!isInternal" />
      <b-icon-eye-slash v-else />
      {{ isInternal ? 'Internal-Only' : 'Ok to Share' }}
    </b-form-checkbox>
    <template v-slot:footer>
      <b-btn-group class="d-flex w-100 justify-content-evenly">
        <b-btn variant="outline-secondary">Draft Saved</b-btn>
        <b-btn variant="outline-secondary">Submit</b-btn>
        <b-btn variant="outline-secondary">
          <b-icon-trash />
        </b-btn>
      </b-btn-group>
    </template>
  </b-card>
</template>

<script>
import TextArea from './text-area'
export default {
  components: {
    TextArea
  },
  props: ['tab', 'clients'],
  data() {
    return {
      client: null,
      isInternal: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
