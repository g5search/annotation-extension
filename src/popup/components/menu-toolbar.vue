<template>
  <b-container fluid class="px-0 menu-toolbar">
    <b-row no-gutters>
      <b-col>
        <b-btn-group size="sm" class="d-flex w-100">
          <b-btn
            id="login"
            :variant="hasToken ? 'primary' : 'outline-primary'"
            to="/login"
            class="flex-grow-0"
          >
            <b-icon-gear />
          </b-btn>
          <b-tooltip
            target="login"
            triggers="hover"
            variant="primary"
            placement="bottom"
          >
            Configure
          </b-tooltip>
          <b-btn
            id="home"
            to="/"
            variant="outline-primary"
            class="flex-grow-0"
          >
            <b-icon-house-door />
          </b-btn>
          <b-tooltip
            target="home"
            triggers="hover"
            variant="primary"
            placement="bottom"
          >
            Notes
          </b-tooltip>
          <b-btn
            id="new-home"
            to="/new-index"
            variant="outline-primary"
            class="flex-grow-0"
          >
            <b-icon-book />
          </b-btn>
          <b-tooltip
            target="new-home"
            triggers="hover"
            variant="primary"
            placement="bottom"
          >
            New Index
          </b-tooltip>
          <div class="flex-grow-1 bg-primary" />
          <slot name="append" />
        </b-btn-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  computed: {
    hasToken() {
      return this.$store.getters.hasToken
      // return false
    }
  }
}
</script>

<style lang="scss">
.menu-toolbar {
  box-shadow: 0 2px 15px rgba(12, 35, 63, 0.5);
  transition: 200ms ease-out;
  &:hover {
    box-shadow: 0 2px 5px rgba(12, 35, 63, 0.8);
  }
}
</style>