<template>
  <b-card>
    <template v-slot:header>
      Saved Drafts, Submit, Discard
    </template>
    <text-area />
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
