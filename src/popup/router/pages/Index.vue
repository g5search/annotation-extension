<template>
  <b-container fluid class="p-1 my-2">
    <b-row no-gutters>
      <b-col>
        <b-card
          no-body
          class="border-0 py-1 px-2 note"
          header-class="p-0 border-0"
          footer-class="p-0"
          footer-bg-variant="white"
        >
          <template v-slot:header>
            <b-alert
              :show="dismissCountDown"
              @dismissed="dismissCountDown = 0"
              @dismiss-count-down="countDownChanged"
              id="submission-status"
              variant="success"
              dismissible
            >
              <b-icon-check />
              Saved Successfully!
            </b-alert>
          </template>
          <b-form-group
            label-class="py-0 text-secondary"
            class="mt-1"
          >
            <template v-slot:label>
              <label class="mb-0 d-flex w-100 align-items-center justify-content-start">
                <b-icon-briefcase />
                <span class="ml-2 flex-grow-1">
                  Client
                  <span class="smaller roman text-tertiary">
                    *
                  </span>
                </span>
                <b-btn
                  id="auto-detect-client"
                  @click="autoDetect"
                  variant="light"
                  size="sm"
                  class="text-secondary flex-grow-0"
                >
                  <b-icon-bucket-fill v-if="detectedClient" />
                  <b-icon-bucket v-else />
                  Auto
                </b-btn>
                <b-tooltip
                  target="auto-detect-client"
                  triggers="hover"
                  variant="secondary"
                  placement="top"
                >
                  Attempt to detect from current webpage
                </b-tooltip>
                <b-btn
                  id="refresh-client-list"
                  @click="refreshClients"
                  variant="light"
                  size="sm"
                  class="text-secondary"
                >
                  <b-spinner v-if="isBusy" small />
                  <b-icon-arrow-clockwise v-else />
                  {{ clients.length }}
                </b-btn>
                <b-tooltip
                  target="refresh-client-list"
                  triggers="hover"
                  variant="secondary"
                  placement="top"
                >
                  Reload Clients
                </b-tooltip>
              </label>
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
              <label class="mb-0 d-flex w-100 align-items-center justify-content-start">
                <b-icon-building />
                <span class="ml-2 flex-grow-1">
                  Location
                </span>
                <b-btn
                  id="toggle-location-select"
                  @click="showLocation = !showLocation"
                  variant="light"
                  size="sm"
                  class="text-secondary flex-grow-0"
                >
                  <b-icon-eye-fill v-if="!showLocation" />
                  <b-icon-eye-slash-fill v-else />
                </b-btn>
              </label>
            </template>
            <vue-multiselect
              v-if="showLocation"
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
              <span class="smaller roman text-tertiary">
                *
              </span>
            </template>
            <b-form-select
              v-model="category"
              :options="categories"
              :invalid-feedback="categoryInvalid"
            />
            <!-- <vue-multiselect
              v-model="category"
              :options="categories"
            /> -->
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
              </template>
              <div class="editor">
                <editor-menu-bar
                  :editor="editor"
                  v-slot="{ commands, isActive }"
                >
                  <div class="d-flex justify-content-start menubar">
                    <b-btn
                      :class="[{ 'is-active': isActive.bold() }, 'menubar__btn']"
                      @click="commands.bold"
                      variant="outline-secondary"
                    >
                      <b-icon-type-bold />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.italic() }, 'menubar__btn']"
                      @click="commands.italic"
                      variant="outline-secondary"
                    >
                      <b-icon-type-italic />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.underline() }, 'menubar__btn']"
                      @click="commands.underline"
                      variant="outline-secondary"
                    >
                      <b-icon-type-underline />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.strike() }, 'menubar__btn']"
                      @click="commands.strike"
                      variant="outline-secondary"
                    >
                      <b-icon-type-strikethrough />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.ordered_list() }, 'menubar__btn']"
                      @click="commands.ordered_list"
                      variant="outline-secondary"
                    >
                      <b-icon-list-ol />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.bullet_list() }, 'menubar__btn']"
                      @click="commands.bullet_list"
                      variant="outline-secondary"
                    >
                      <b-icon-list-ul />
                    </b-btn>
                    <div class="menubar__spacer bg-secondary d-flex justify-content-end">
                      <b-form-checkbox
                        v-model="isInternal"
                        switch
                        size="sm"
                        class="text-light align-self-center pr-2"
                      >
                        <b-icon-eye-fill v-if="!isInternal" />
                        <b-icon-eye-slash v-else />
                        {{ isInternal ? 'Internal-Only' : 'Ok to Share' }}
                      </b-form-checkbox>
                    </div>
                  </div>
                </editor-menu-bar>
                <editor-content :editor="editor" class="editor__content" />
              </div>
            </b-form-group>
          </b-card>
          <template v-slot:footer>
            <b-btn-group class="w-100 d-flex">
              <b-btn
                @click="onSubmit"
                :disabled="!isValid"
                :variant="isValid ? 'secondary' : 'outline-secondary'"
                class="roman flex-grow-1"
              >
                <b-icon-bookmark-plus />
                Save Note
              </b-btn>
              <b-btn
                id="reset"
                @click="onReset"
                variant="outline-tertiary"
                class="ml-1 px-2 roman flex-grow-0"
              >
                <b-icon-trash />
              </b-btn>
            </b-btn-group>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'
import HubHelpers from '../hub-helpers'
// import TextArea from '../../components/text-area'
export default {
  components: {
    VueMultiselect,
    // TextArea,
    EditorContent,
    EditorMenuBar
  },
  mixins: [HubHelpers],
  data () {
    return {
      editor: null,
      showLocation: false,
      theme: 'secondary',
      client: null,
      detectedClient: false,
      isBusy: false,
      startDate: null,
      endDate: null,
      locations: [],
      category: null,
      isInternal: true,
      annotation: {
        html: '',
        cleared: true,
        json: ''
      },
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
      ],
      category: null,
      categories: [
        { text: 'Select Option', value: null },
        { text: 'Account Changes', value: 'Account Changes' },
        { text: 'Customer Contact', value: 'Customer Contact' },
        { text: 'General Note', value: 'General Note' },
        { text: 'Optimizations', value: 'Optimizations' },
        { text: 'Other', value: 'Other' },
        { text: 'Technical Issue', value: 'Technical Issue' }
      ],
      actionType: null,
      actionTypes: {
        'Account Changes': [
          { text: 'Select Option', value: null },
          'Smart Bidding Strategy Change',
          'Specials/Promotions',
          'Spend Optimizer Version Change',
          'URL Change',
          'Whitelisting Events Change'
        ],
        'General Note': [
          { text: '-', value: 'none' }
        ],
        'Customer Contact': [
          { text: 'Select Option', value: null },
          'Action Items',
          'Analysis/Notes'
        ],
        'Optimizations': [
          { text: 'Select Option', value: null },
          'Added Negative Keywords',
          'Added Keywords',
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
      dismissSecs: 2,
      dismissCountDown: 0,
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new OrderedList(),
        new BulletList(),
        new ListItem(),
        new Bold(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: this.annotation,
      onUpdate: ({ getHTML, getJSON }) => {
        this.updateText({ html: getHTML(), json: getJSON() })
      }
    })
  },
  computed: {
    ...mapState({
      clients: state => state.clients,
      clientLocations: state => state.locations
    }),
    isValid() {
      return this.category !== null && this.client !== null
    },
    categoryInvalid() {
      return (this.category !== null)
        ? ''
        : 'Category is required.'
    }
  },
  created() {
    this.autoDetect()
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    onReset() {
      this.client = null
      this.locations = []
      this.showAlert = true
      this.category = null
      this.actionType = null
      this.editor.clearContent()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    autoDetect() {
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, (tabs) => {
        const url = tabs[0].url
        chrome.runtime.sendMessage({
          msg: 'auto-detect',
          url
        }, (res) => {
          if (res.client) {
            this.client = res.client
            this.detectedClient = true
          }
          if (res.selectedLocations) {
            this.locations = res.selectedLocations
          }
        })
      })
    },
    refreshClients() {
      this.isBusy = true
      chrome.runtime.sendMessage({
        msg: 'reload-clients'
      }, () => {
        this.client = null,
        this.detectedClient = false
        this.isBusy = false
      })
    },
    onSubmit() {
      chrome.runtime.sendMessage({
        msg: 'create-note',
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
        this.client = null
        this.locations = []
        this.category = null
        this.actionType = null
        this.detectedClient = false
        this.editor.clearContent()
        this.showAlert()
      })
    },
    onRun(payload) {
      this.category = payload.category
      this.actionType = payload.actionType
      this.isInternal = payload.isInternal
    },
    updateText(data) {
      this.annotation = data
    },
    onClientSelect() {
      this.isBusy = true
      chrome.runtime.sendMessage({
        msg: 'locations',
        data: {
          id: 1,
          prop: 'urn',
          value: this.client.urn
        }
      }, () => {
        this.isBusy = false
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
.smaller {
  font-size: 0.8em;
}
.editor {
  &__content {
    font-size: 0.9em;
    padding: 0.5em 0.5em 0.25em;
    border: 1px solid #7898ad;
    border-top: none;
    color: #0b233f;
    & .is-empty {
      color: grey;
    }
  }
  & .menubar {
    transition: 200ms ease-out;
    display: flex;
    &__spacer {
      flex: 1 1 auto;
    }
    &__btn {
      padding: 0.15em 0.25em;
      margin: 0;
      &.is-active {
        background-color: #7898ad;
        color: white;
      }
    }
  }
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
