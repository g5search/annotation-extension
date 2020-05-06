<template>
  <b-container fluid class="px-0 menu-toolbar">
    <b-row no-gutters>
      <b-col>
        <b-btn-group size="sm" class="d-flex w-100">
          <b-btn to="/login" variant="outline-primary" class="flex-grow-0">
            <b-icon-gear />
          </b-btn>
          <b-btn to="/" variant="outline-primary" class="flex-grow-0">
            <b-icon-house-door />
          </b-btn>
          <div class="flex-grow-1 bg-primary" />
          <slot name="append" />
        </b-btn-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.menu-toolbar {
  box-shadow: 0 2px 15px rgba(12, 35, 63, 0.5);
  transition: 200ms ease-out;
}
</style>