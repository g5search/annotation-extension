<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Popup Vue content'
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
