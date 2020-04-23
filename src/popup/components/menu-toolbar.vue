<template>
  <b-container fluid class="px-0">
    <b-row no-gutters>
      <b-col>
        <b-btn-group size="sm">
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-pencil-square />
          </b-btn>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-file-plus />
          </b-btn>
          <b-dropdown variant="outline-primary" right text="Ex">
            <b-dropdown-item>
              Example
            </b-dropdown-item>
          </b-dropdown>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-inboxes />
          </b-btn>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-paperclip />
          </b-btn>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-question-circle />
          </b-btn>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-house-door />
          </b-btn>
          <b-btn variant="outline-primary" class="flex-grow-0 px-2">
            <b-icon-trash-fill />
          </b-btn>
          <slot name="append" />
        </b-btn-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {

}
</script>

<style>

</style>
