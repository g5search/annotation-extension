<template>
  <b-card
    no-body
    class="border-0 py-1 px-2 note"
    header-class="p-0"
    footer-class="p-0"
    footer-bg-variant="white"
  >
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start menubar">
        <b-btn
          :id="`hub-toggle-${tab}`"
          v-b-toggle="`${tab}-collapse`"
          :variant="`${clientComplete ? 'success' : 'outline-secondary'}`"
          class="px-2"
        >
          <b-icon-building />
        </b-btn>
        <b-dropdown variant="outline-secondary" right>
          <template v-slot:button-content>
            <b-icon-life-preserver />
            Quick Note
          </template>
          <b-dropdown-item
            v-for="macro in macros"
            :key="macro.text"
            @click="onRun(macro.data)"
          >
            {{ macro.text }}
          </b-dropdown-item>
        </b-dropdown>
        <div class="menubar__spacer bg-pale" />
        <div class="bg-pale text-white d-flex align-items-center px-3">
          <b-spinner v-show="!draftSaved" small />
        </div>
        <b-btn
          @click="draftSaved = !draftSaved"
          variant="outline-secondary"
          class="menubar__btn draft-btn"
        >
          <b-icon-file-earmark-diff v-if="!draftSaved" />
          <b-icon-file-earmark-check v-else />
        </b-btn>
        <b-btn @click="onSubmit" variant="outline-secondary" class="menubar__btn">
          <b-icon-bookmark />
        </b-btn>
        <b-btn variant="outline-secondary" class="menubar__btn">
          <b-icon-trash />
        </b-btn>
      </div>
    </template>
    <div class="pb-3 pt-1 px-0">
      <b-collapse
        :id="`${tab}-collapse`"
        visible
      >
        <!-- <client-selector @hub-ready="clientComplete = !clientComplete" /> -->
        <b-form-group
          class="mb-2 text-secondary"
        >
          <template v-slot:label>
            <b-icon-briefcase />
            Client
          </template>
          <vue-multiselect
            v-model="client"
            :options="clients"
            :custom-label="getClientName"
            @input="onClientSelect"
            track-by="urn"
            label="name"
          />
        </b-form-group>
        <b-form-group
          class="mb-1 text-secondary"
        >
          <template v-slot:label>
            <b-icon-building />
            Location
          </template>
          <vue-multiselect
            v-model="location"
            :options="locations"
            :custom-label="getLocationName"
          />
        </b-form-group>
      </b-collapse>
    </div>
    <b-form-group
      label-class="text-secondary"
    >
      <template v-slot:label>
        <b-icon-collection />
        Category
      </template>
      <b-form-select
        v-model="category"
        :options="categories"
      />
    </b-form-group>
    <b-form-group
      v-show="category !== null"
      label-class="text-secondary"
    >
      <template v-slot:label>
        <b-icon-puzzle />
        Action Type
      </template>
      <b-form-select
        v-model="actionType"
        :options="actionTypes[category]"
      />
    </b-form-group>
    <b-card
      :bg-variant="isInternal ? 'quaternary-lt4' : 'white'"
      no-body
      class="border-0 p-2"
    >
      <b-form-group
        label-class="d-flex w-100 align-items-center justify-content-between"
        class="text-secondary"
      >
        <template v-slot:label>
          <span>
            <b-icon-file-richtext />
            Note
          </span>
          <b-form-checkbox
            v-model="isInternal"
            switch
            size="sm"
            class="text-secondary"
          >
            <b-icon-eye-fill v-if="!isInternal" />
            <b-icon-eye-slash v-else />
            {{ isInternal ? 'Internal-Only' : 'Ok to Share' }}
          </b-form-checkbox>
        </template>
        <text-area
          :theme="theme"
          :content="content.html"
          @text-update="onUpdate"
        />
      </b-form-group>
    </b-card>
    {{ content.html }}
  </b-card>
</template>

<script>
// import ClientSelector from './client-selector'
import VueMultiselect from 'vue-multiselect'
import HubHelpers from '../router/hub-helpers'
import TextArea from './text-area'
export default {
  components: {
    VueMultiselect,
    // ClientSelector,
    TextArea
  },
  mixins: [HubHelpers],
  props: ['tab', 'clients'],
  data() {
    return {
      client: null,
      clientLocations: [],
      locations: [],
      clientComplete: false,
      content: {
        html: '',
        json: null
      },
      macros: [
        {
          text: 'Team Member Change',
          data: {
            category: 'Account Changes',
            actionType: 'Team Member Change',
            isInternal: true
          }
        },
        {
          text: 'Dynamic Pricing Start',
          data: {
            category: 'Implementation Dates',
            actionType:'Dynamic Pricing Start',
            isInternal: false
          }
        }
      ],
      category: null,
      categories: [
        { text: 'Select Option', value: null },
        'Account Changes',
        'Customer Contact',
        'General Note',
        'Optmizations',
        'Other',
        'Technical Issue'
      ],
      actionType: null,
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
          'Team Member Change'
        ],
        'General Note': [
          { text: '-', value: null }
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
          'T & O Added',
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
        ]
      },
      isInternal: true,
      draftSaved: true,
      theme: 'secondary'
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    }
  },
  created() {
    this.$store.dispatch('createDraft', {
      id: this.tab,
      urn: '',
      locations: [],
      category: null,
      actionType: null,
      isInternal: true
    })
  },
  methods: {
    onUpdate(payload) {
      this.content = payload
    },
    onClientSelect(payload) {
      this.draftSaved = false
      this.clientComplete = true
      this.$store.dispatch('updateDraft', payload)
      chrome.runtime.sendMessage({
        msg: 'fetchLocations',
        urn: this.client.urn
      }, (res) => {
        this.draftSaved = true
      })
    },
    onRun(payload) {
      this.category = payload.category
      this.actionType = payload.actionType
      this.isInternal = payload.isInternal
    },
    onSubmit() {
      chrome.runtime.sendMessage({
        msg: 'createNote',
        data: {
          category: this.category,
          actionType: this.actionType,
          urn: this.urn
        }
      }, (res) => console.log(res))
    }
  }
}
</script>

<style lang="scss" scoped>
.note {
  &__content {
    font-size: 0.9em;
  }
  & .menubar {
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
}
</style>
