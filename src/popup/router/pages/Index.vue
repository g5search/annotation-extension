<template>
  <b-container fluid class="p-1 my-2">
    <b-row no-gutters>
      <b-col>
        <b-card
          no-body
          class="border-0 py-1 px-2 note"
          header-class="p-0"
          footer-class="p-0"
          footer-bg-variant="white"
        >
          <template v-slot:header>
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
                placement="right"
              >
                Quick Notes
              </b-tooltip>
              <div class="menubar__spacer bg-pale" />
              <div class="bg-pale text-white d-flex align-items-center px-3">
                <b-spinner v-if="!draftSaved" small />
                <b-icon-check v-else />
              </div>
              <b-btn
                :disabled="true"
                variant="outline-secondary"
                class="menubar__btn"
              >
                <b-icon-trash />
              </b-btn>
            </div>
          </template>
          <b-form-group
            class="my-2 text-secondary"
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
            class="mb-2 text-secondary"
          >
            <template v-slot:label>
              <b-icon-building />
              Location
            </template>
            <vue-multiselect
              v-model="locations"
              :options="clientLocations"
              :custom-label="getLocationName"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              placeholder="Search"
              track-by="urn"
              label="name"
            >
              <template
                slot="selection"
                slot-scope="{ values, search, isOpen }"
              >
                <span
                  v-if="values.length && !isOpen"
                  class="multiselect__single"
                >
                  {{ values.length }} location(s) selected
                </span>
              </template>
            </vue-multiselect>
          </b-form-group>
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
              required
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
              required
            />
          </b-form-group>
          <b-card
            :bg-variant="isInternal ? 'quaternary-lt4' : 'white'"
            no-body
            class="border-0 p-2 mb-2"
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
                :content="annotation.html"
                @text-update="updateText"
              />
            </b-form-group>
          </b-card>
          <template v-slot:footer>
            <b-btn
              @click="onSubmit"
              :disabled="!isValid"
              variant="secondary"
              block
              class="roman"
            >
              <b-icon-bookmark-plus />
              Submit Note
            </b-btn>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import HubHelpers from '../hub-helpers'
import TextArea from '../../components/text-area'
export default {
  components: {
    VueMultiselect,
    TextArea
  },
  mixins: [HubHelpers],
  data () {
    return {
      theme: 'secondary',
      client: null,
      locations: [],
      category: null,
      isInternal: true,
      annotation: {
        html: '',
        json: ''
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
        },
        {
          text: 'Budget Change',
          data: {
            category: 'Account Changes',
            actionType: 'Budget Change',
            isInternal: false
          }
        },
        {
          text: 'Shape Autopilot Paused',
          data: {
            category: 'Account Changes',
            actionType: 'Shape Autopilot Paused',
            isInternal: true
          }
        },
        {
          text: 'Shape Autopilot Activated',
          data: {
            category: 'Account Changes',
            actionType: 'Shape Autopilot Activated',
            isInternal: true
          }
        },
        {
          text: 'Dynamic Pricing Start',
          data: {
            category: 'Implementation Dates',
            actionType: 'Dynamic Pricing Start',
            isInternal: false
          }
        },
        {
          text: 'Dynamic Pricing End',
          data: {
            category: 'Implementation Dates',
            actionType: 'Dynamic Pricing End',
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
        'Technical Issue',
        'Implementation Dates'
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
          'Team Member Change',
          'Location DA Start',
          'Location DA End',
          'Budget Change',
          'Shape Autopilot Activated',
          'Shape Autopilot Paused'
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
      },
      isInternal: true,
      draftSaved: true
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    clientLocations() {
      return this.$store.getters.locations
    },
    isValid() {
      return this.category !== null &&
        this.actionType !== null &&
        this.locations.length > 0 &&
        this.client !== null
    }
  },
  methods: {
    onSubmit() {
      this.draftSaved = false
      chrome.runtime.sendMessage({
        msg: 'createNote',
        data: {
          clientUrn: this.client.urn,
          internal: this.isInternal,
          locationUrns: this.locations.map(l => l.urn),
          category: this.category,
          actionType: this.actionType,
          html: this.annotation.html,
          annotation: this.annotation.json,
          startDate: null,
          endDate: null
        }
      }, () => {
        this.draftSaved = true
        this.client = null
        this.locations = []
        this.category = null
        this.actionType = null
        this.annotation.html = ''
        this.annotation.json = ''
      })
    },
    onRun(payload) {
      this.category = payload.category
      this.actionType = payload.actionType
      this.isInternal = payload.isInternal
    },
    updateText(data) {
      console.log({ data })
      this.annotation = data
    },
    onClientSelect(payload) {
      this.draftSaved = false
      chrome.runtime.sendMessage({
        msg: 'locations',
        data: {
          id: 1,
          prop: 'urn',
          value: this.client.urn
        }
      }, () => {
        this.draftSaved = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@1,700&display=swap');
.roman {
  font-family: 'Vollkorn', 'Times New Roman', Times, serif;
  font-style: italic;
  font-weight: 700;
}
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
.close-container {
  position: relative;
  & .close-tab {
    position: absolute;
    right: 0;
    border-radius: 50%;
    padding: 0 0.05em;
    transform: translate(75%, -275%);
    transition: all 200ms ease;
    opacity: 0;
    transition-delay: 100ms;;
  }
  &:hover .close-tab {
    transform: translate(75%, -75%);
    opacity: 1;
  }
}
.add-btn {
  position: relative;
  border: none;
  margin-left: 0.15em;
  padding: 0;
  transition: 200ms ease-in-out;
  &:hover,
  &:active {
    background-color: #dee2e6;
    border: none;
    outline: none;
    & .nav-link::after {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
      content: "add";
    }
  }
  & .nav-link {
    padding-left: 0.25em;
    padding-right: 0.25em;
  }
}
.shake-bottom {
  animation: shake-bottom 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2020-4-28 14:22:3
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */
/**
 * ----------------------------------------
 * animation shake-bottom
 * ----------------------------------------
 */
@keyframes shake-bottom {
  0%,
  100% {
    transform: rotate(0deg);
    transform-origin: 50% 100%;
  }
  10% {
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    transform: rotate(4deg);
  }
  80% {
    transform: rotate(-2deg);
  }
  90% {
    transform: rotate(2deg);
  }
}
</style>
