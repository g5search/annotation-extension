<template>
  <div id="app-root">
     <b-sidebar
      id="sidebar-1"
      title="Options"
      right
      shadow
    >
      <b-card class="p-1">
        <template v-slot:header>
          <b-btn
            @click="openOptions"
            variant="outline-tertiary"
          >
            Open Extension Options Page
          </b-btn>
        </template>
        <code lang="json" class="d-block text-tertiary">
          {{ store }}
        </code>
        <template v-slot:footer>
          <b-form-text class="text-right">
            {{ version }}
          </b-form-text>
        </template>
      </b-card>
    </b-sidebar>
    <menu-toolbar>
      <template v-slot:append>
        <b-btn
          v-b-toggle.sidebar-1
          variant="outline-primary"
          class="flex-grow-0 px-2"
        >
          <b-icon-question-circle />
        </b-btn>
      </template>
    </menu-toolbar>
    <router-view />
  </div>
</template>

<script>
import { version } from '../../package.json'
import MenuToolbar from '../popup/components/menu-toolbar'
export default {
  components: {
    MenuToolbar
  },
  data () {
    return {
      version
    }
  },
  computed: {
    store() {
      return this.$store.getters.drafts
    }
  },
  methods: {
     openOptions() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage()
      } else {
        window.open(chrome.runtime.getURL('options.html'))
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Roboto:400,700&display=swap');
$theme-colors: (
  'primary': #0b233f,
  'secondary': #7898ad,
  'tertiary': #e8513e,
  'quaternary': #eee23e,
  'pale': #dee2e6,
  'quaternary-lt4': rgba(236, 233, 178, 0.5),
  'success': #52be99
);
// $body-bg: #e1e5e9;
$enable-rounded: false;
$enable-shadows: false;
$enable-gradients: false;
$font-family-base: 'Roboto', sans-serif;
$headings-font-family: 'Roboto Slab', sans-serif;

@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
h1,h2,h3 {
  font-weight: 700;
}
.custom-select {
  background: none !important;
}

#app-root {
  min-width: 400px;
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
