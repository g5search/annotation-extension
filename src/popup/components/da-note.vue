<template>
  <b-card no-body class="border-0" footer-class="p-0">
    <text-area />
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
  }
}
</script>

<style lang="scss" scoped>

</style>
