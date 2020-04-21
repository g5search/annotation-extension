<template>
  <b-container fluid class="p-3">
    <b-row>
      <b-col>
        <b-card header="A header" class="border">
          {{ msg }}
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
      msg: pkg.version
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
