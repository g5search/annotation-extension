<template>
<div class="d-flex w-100 justify-content-start menubar">
    <b-dropdown
      id="macro-dropdown"
      variant="outline-secondary"
      right
    >
      <template v-slot:button-content>
        <b-icon-lightning-fill />
      </template>
      <b-dropdown-item
        v-for="macro in macros"
        :key="macro.text"
        @click="onRun(macro.data)"
      >
        {{ macro.text }}
      </b-dropdown-item>
    </b-dropdown>
    <b-tooltip
      target="macro-dropdown"
      triggers="hover"
      variant="secondary"
      placement="top"
    >
      Quick note
    </b-tooltip>
    <b-btn
      id="clear-note"
      @click="$emit('reset')"
      variant="outline-tertiary"
      class="px-1"
    >
      <b-icon-trash />
    </b-btn>
    <b-tooltip
      target="clear-note"
      triggers="hover"
      variant="tertiary"
      placement="top"
    >
      <b-icon-exclamation-triangle-fill />
      Abandon current note
    </b-tooltip>
    <div class="menubar__spacer bg-pale" />
    <slot name="append" />
    <div
      v-if="canContentScript"
      class="bg-pale text-white d-flex align-items-center px-3"
    >
      <b-badge
        variant="tertiary"
        class="px-3 py-1 better-badge"
      >
        <b-icon-arrow-repeat />
        {{ currentDomain }}
      </b-badge>
    </div>
    <div class="bg-pale text-white d-flex align-items-center px-3">
      <b-spinner v-if="isBusy" small />
      <b-icon-check v-else />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    isBusy: {
      type: Boolean,
      default() { return false }
    }
  },
  data() {
    return {
      canContentScript: false,
      currentDomain: '',
      macros: [
        {
          text: 'Location DA Start',
          data: {
            category: 'Account Changes',
            actionType: 'Location DA Start',
            isInternal: false
          }
        },
        {
          text: 'Location DA End',
          data: {
            category: 'Account Changes',
            actionType: 'Location DA End',
            isInternal: false
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      onUpdate: 'updateField'
    }),
    onRun(data) {
      this.onUpdate({ key: 'category', value: data.category })
      this.onUpdate({ key: 'actionType', value: data.actionType })
      this.onUpdate({ key: 'isInternal', value: data.isInternal })
    }
  }
}
</script>

<style lang="scss" scoped>
.better-badge {
  border-radius: 10px / 25%;
  box-shadow: 0px 0px 2px rgba(206, 15, 105, 0.75),
              0px 1px 5px rgba(232, 81, 63, 0.75),
              0px 2px 10px rgba(255, 189, 0, 0.75);
}
.menubar {
  box-shadow: 0 2px 10px rgba(120, 152, 173, 0.2);
  transition: 200ms ease-out;
  display: flex;
  &:hover {
    box-shadow: 0 2px 15px rgba(120, 152, 173, 0.2);
  }
  &__spacer {
    flex: 1 1 auto;
  }
  &__btn {
    position: relative;
    padding: 0.15em 0.25em;
    margin: 0;
    & .is-active {
      background-color: #0b233f;
      color: white;
    }
    &:hover {
      &.draft-btn::after {
        content: 'save';
        position: absolute;
        color: #0b233f;
        left: 50%;
        transform: translate(-50%, -80%);
        height: 100%;
      }
    }
  }
}
</style>
