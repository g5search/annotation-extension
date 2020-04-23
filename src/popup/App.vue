<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Sans:400,700|Roboto+Condensed:700&display=swap');
$theme-colors: (
  'primary': #0b233f,
  'secondary': #7898ad,
  'tertiary': #e8513e,
  'quaternary': #eee23e
);
// $body-bg: #e1e5e9;
$enable-rounded: false;
$enable-shadows: false;
$enable-gradients: false;
$font-family-base: 'Fira Sans', sans-serif;
$headings-font-family: 'Roboto Condensed', sans-serif;
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
</style>
