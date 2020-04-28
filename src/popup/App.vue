<template>
  <div>
    <menu-toolbar>
      <template v-slot:append>
        <b-btn
          v-b-toggle.sidebar-1
          variant="primary"
          class="flex-grow-0 px-2"
        >
          <b-icon-three-dots-vertical />
        </b-btn>
      </template>
    </menu-toolbar>
    <router-view />
  </div>
</template>

<script>
import MenuToolbar from '../popup/components/menu-toolbar'
export default {
  components: {
    MenuToolbar
  },
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
  'quaternary': #eee23e,
  'quaternary-lt4': rgba(236, 233, 178, 0.5)
);
// $body-bg: #e1e5e9;
$enable-rounded: false;
$enable-shadows: false;
$enable-gradients: false;
$font-family-base: 'Fira Sans', sans-serif;
$headings-font-family: 'Roboto Condensed', sans-serif;

// @import 'node_modules/vue-multiselect/dist/vue-multiselect.min.css';
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
.custom-select {
  background: none !important;
}

.multiselect__spinner:after,
.multiselect__spinner:before {
  border-top-color: #0b233f;
}
.multiselect__tag,
.multiselect__option--highlight,
.multiselect__option--highlight:after {
  background: #0b233f;
}
.multiselect__tag-icon:hover {
  background:#0b233f;
}
.multiselect__tag-icon:after {
  color:#b1c4d2;
}
.multiselect__option--selected.multiselect__option--highlight,
.multiselect__option--selected.multiselect__option--highlight:after,
.multiselect__option--group-selected.multiselect__option--highlight,
.multiselect__option--group-selected.multiselect__option--highlight:after {
  background:#e94f3c;
}
</style>
