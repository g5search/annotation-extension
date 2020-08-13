<template>
  <b-card
    no-body
    class="border-0 py-1 px-2 note"
    header-class="p-0"
    footer-class="p-0"
    footer-bg-variant="white"
  >
    <template v-slot:header>
      <note-toolbar :is-busy="isBusy" />
    </template>
    <b-form-group label-class="text-secondary py-0" class="mt-1">
      <template v-slot:label>
        <label class="mb-0 d-flex w-100 align-items-center justify-content-start">
          <b-icon-briefcase />
          <span class="ml-2 flex-grow-1">
            Client
          </span>
          <b-btn
            id="refresh-client-list"
            @click="refreshClients"
            variant="light"
            size="sm"
            class="text-secondary"
          >
            <b-spinner v-if="isClientsBusy" small />
            <b-icon-arrow-clockwise v-else />
            {{ clients.length }}
          </b-btn>
          <b-btn
            id="clear-clients"
            @click="$store.dispatch('dropClients')"
            variant="light"
            size="sm"
            class="text-secondary"
          >
            <b-icon-trash />
          </b-btn>
        </label>
        <b-tooltip
          target="refresh-client-list"
          triggers="hover"
          variant="secondary"
          placement="left"
        >
          Reload Clients
        </b-tooltip>
      </template>
      <vue-multiselect
        :value="selectedClient"
        :options="clients"
        :custom-label="getClientName"
        @input="onClientSelect"
      />
    </b-form-group>
    <b-form-group label-class="text-secondary">
      <template v-slot:label>
        <b-icon-collection />
        Category
      </template>
      <b-form-select
        :value="category"
        :options="categories"
        @input="onUpdate({ key: 'category', value: $event })"
        required
      />
    </b-form-group>
    <b-form-group label-class="text-secondary">
      <template v-slot:label>
        <b-icon-puzzle />
        Action Type
      </template>
      <b-form-select
        id="action-type-select"
        :value="actionType"
        :options="actionTypes[category]"
        @input="onUpdate({ key: 'actionType', value: $event })"
        required
      />
    </b-form-group>
  </b-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import HubHelpers from '../../popup/router/hub-helpers'
import TextArea from './text-area'
import NoteToolbar from './note-toolbar'
export default {
  components: {
    VueMultiselect,
    HubHelpers,
    TextArea,
    NoteToolbar
  },
  mixins: [HubHelpers],
  data() {
    return {
      theme: 'secondary',
      isBusy: false,
      isClientsBusy: false,
      canContentScript: true,
      currentDomain: 'Shape',
      categories: [
        { text: 'Select Option', value: null },
        'Account Changes',
        'Customer Contact',
        'General Note',
        'Optmizations',
        'Other',
        'Technical Issue',
        'Implementation Dates'
      ],
      actionTypes: {
        'Account Changes': [
          { text: 'Select Option', value: null },
          'Dynamic Ads Updates',
          'Branded Name Change',
          'Smart Bidding Strategy Change',
          'Specials/Promotions',
          'Spend Optimizer Version Change',
          'URL Change',
          'Whitelisting Events Change',
          'Team Member Change',
          'Location DA Start',
          'Location DA End',
          'Budget Change',
          'Shape Autopilot Activated',
          'Shape Autopilot Paused'
        ],
        'General Note': [
          { text: '-', value: 'None' }
        ],
        'Customer Contact': [
          { text: 'Select Option', value: null },
          'Action Items',
          'Analysis/Notes'
        ],
        'Optmizations': [
          { text: 'Select Option', value: null },
          'Added Negative Keywords',
          'Changed Location Strategy',
          'Paused Campaign',
          'Enabled Campaign',
          'Refreshed Ad Copy',
          'Testing',
          'T&O Added',
          'Manual Spend Adjustments',
          'Manual Bid Adjustments'
        ],
        'Other': [
          { text: 'Select Option', value: null },
          'Uncontrollable Circumstances'
        ],
        'Technical Issue': [
          { text: 'Select Option', value: null },
          'DA WoW',
          'Dynamic Pricing',
          'Dynamic Availability',
          'Reporting Issue'
        ],
        'Implementation Dates': [
          { text: 'Select Option', value: null },
          'Dynamic Pricing Start',
          'Dynamic Pricing End',
          'Dynamic Availability Start',
          'Dynamic Availability End',
          'Spend Optimizer Start',
          'Spend Optimizer End',
          'Call Scoring Start',
          'Call Scoring End',
          'First Impressions',
          'First Spend'
        ]
      }
    }
  },
  computed: {
    ...mapState({
      clients: state => state.clients,
      selectedClient: state => state.client,
      locations: state => state.locations,
      category: state => state.category,
      actionType: state => state.actionType,
      selectedLocations: state => state.selectedLocations
    })
  },
  methods: {
     refreshClients() {
      this.isClientBusy = true
      chrome.runtime.sendMessage({
        msg: 'reload-clients'
      }, () => {
        this.isClientBusy = false
      })
    },
    onClientSelect(payload) {
      this.isBusy = true
      this.setClient(payload)
      chrome.runtime.sendMessage({
        msg: 'locations',
        data: {
          id: 1,
          prop: 'urn',
          value: payload.urn
        }
      }, () => {
        this.isBusy = false
      })
    },
    ...mapActions({
      setClient: 'setClient',
      setSelectedLocations: 'setSelectedLocations',
      onUpdate: 'updateField'
    })
  }
}
</script>

<style lang="scss" scoped>
.roman {
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
  font-weight: 700;
}
// .better-badge {
//   border-radius: 10px / 25%;
//   box-shadow: 0 1px 2px rgba(206, 15, 105, 0.75),
//               0 2px 5px rgba(232, 81, 63, 0.5),
//               0 3px 8px rgba(255, 189, 0, 0.5);
// }
.note {
  &__content {
    font-size: 0.9em;
  }
  // & .menubar {
  //   box-shadow: 0 2px 10px rgba(120, 152, 173, 0.2);
  //   transition: 200ms ease-out;
  //   display: flex;
  //   &:hover {
  //     box-shadow: 0 2px 15px rgba(120, 152, 173, 0.2);
  //   }
  //   &__spacer {
  //     flex: 1 1 auto;
  //   }
  //   &__btn {
  //     position: relative;
  //     padding: 0.15em 0.25em;
  //     margin: 0;
  //     & .is-active {
  //       background-color: #0b233f;
  //       color: white;
  //     }
  //     &:hover {
  //       &.draft-btn::after {
  //         content: 'save';
  //         position: absolute;
  //         color: #0b233f;
  //         left: 50%;
  //         transform: translate(-50%, -80%);
  //         height: 100%;
  //       }
  //     }
  //   }
  // }
}
</style>
