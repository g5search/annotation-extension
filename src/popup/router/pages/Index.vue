<template>
  <b-container fluid class="px-2 py-1 my-1">
    <b-row no-gutters>
      <b-col>
        <b-card
          no-body
          class="border-0 p-2 note alert-anchor"
          header-class="p-0 border-0"
          footer-class="p-0 border-0"
          footer-bg-variant="white"
        >
          <b-form-group
            label-class="pt-1 pb-0 text-secondary d-flex w-100 align-items-center justify-content-start"
            class="mb-1 mt-0 px-2"
          >
            <template v-slot:label>
              <b-icon-briefcase />
              <span class="ml-2 flex-grow-1">
                Client
                <span class="smaller roman text-tertiary">
                  *
                </span>
              </span>
              <b-btn
                id="auto-detect-client"
                @click="autoDetect(manual = true)"
                variant="light"
                size="sm"
                class="text-secondary flex-grow-0 btn-rad"
              >
                <b-icon-bucket-fill v-if="detectedClient" />
                <b-spinner v-else-if="autoIsBusy" small />
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
                class="text-secondary btn-rad"
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
            </template>
            <vue-multiselect
              v-model="client"
              :options="clients"
              :custom-label="getClientName"
              @input="onClientSelect"
              placeholder="Search"
              track-by="urn"
              label="name"
            >
              <template v-slot:option="{ option }">
                 <b>
                  {{ option.name }}
                </b>
                <p class="text-muted small mb-0">
                  {{ option.brandedName }}
                </p>
                <p class="text-muted small mb-0">
                  {{ option.urn }}
                </p>
              </template>
            </vue-multiselect>
          </b-form-group>
          <b-form-group
            v-show="clientLocations"
            label-class="pb-0 pt-1 text-secondary"
            class="my-1 px-2"
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
              :clear-on-select="true"
              placeholder="Search"
              track-by="urn"
              label="name"
            >
              <template v-slot:selection="{ values, isOpen }">
                <span
                  v-if="values.length > 1 && !isOpen"
                  class="multiselect__single"
                >
                  {{ values.length }} location(s) selected
                </span>
              </template>
              <template v-slot:option="{ option }">
                <div class="d-flex">
                  <div class="mr-2">
                    <p class="mb-0 text-muted small">
                      {{ option.offPlatform !== 'false' ? 'Self-Hosted' : '' }}
                    </p>
                    <b :class="option.status === 'Live' ? 'text-success' : 'text-warning'">
                      {{ option.status }}
                    </b>
                  </div>
                  <div>
                    <b>
                      {{ option.name }}
                    </b>
                    <p class="text-muted small mb-0">
                      {{ option.displayName }}
                    </p>
                    <i class="text-muted small mb-0">
                      {{ option.urn }}
                    </i>
                  </div>
                </div>
              </template>
            </vue-multiselect>
          </b-form-group>
          <b-card no-body class="my-2 py-1 px-2">
            <b-form-group
              label-cols="4"
              label-class="text-secondary py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-people-fill />
                Team
                <span class="smaller text-tertiary">
                  *
                </span>
              </template>
              <b-form-select
                v-model="team"
                :options="teams"
              />
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-class="text-secondary py-1"
              class="my-1"
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
                :options="categories[team]"
                :invalid-feedback="categoryInvalid"
              />
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-class="text-secondary py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-puzzle />
                Action Type
              </template>
              <b-form-select
                v-model="actionType"
                :options="actionTypes[category][team]"
                @change="toggleDates"
                required
              />
            </b-form-group>
            <div v-show="showDates">
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="mb-0 mt-1"
              >
                <template v-slot:label>
                  Start Date
                </template>
                <b-form-datepicker
                  v-model="startDate"
                  size="sm"
                />
              </b-form-group>
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="my-0"
              >
                <template v-slot:label>
                  End Date
                </template>
                <b-form-datepicker
                  v-model="endDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                  size="sm"
                />
              </b-form-group>
            </div>
          </b-card>
          <b-card
            :bg-variant="isInternal ? 'quaternary-lt4' : 'white'"
            no-body
            class="border-0 p-2 mb-2"
          >
            <b-form-group
              label-class="d-flex w-100 align-items-center justify-content-between"
              class="my-1 text-secondary"
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
                  class="align-self-center pr-2"
                >
                  <b-icon-eye-fill v-if="!isInternal" />
                  <b-icon-eye-slash v-else />
                  {{ isInternal ? 'Internal-Only' : 'Ok to Share' }}
                </b-form-checkbox>
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
                    <div class="menubar__spacer bg-secondary" />
                  </div>
                </editor-menu-bar>
                <editor-content :editor="editor" class="editor__content" />
              </div>
            </b-form-group>
            <div v-if="!isInternal" class="px-2">
              <b-form-checkbox
                id="toggle-promoted"
                v-model="promoted"
                :class="promoted ? 'text-success' : 'text-secondary'"
                switch
                size="sm"
              >
                <b-icon-star-fill v-if="promoted" />
                <b-icon-star v-else />
                {{ promoted ? 'Promoted!' : 'Promote' }}
              </b-form-checkbox>
            </div>
          </b-card>
          <b-card no-body class="mb-1 p-1">
           <b-form-checkbox
              v-model="backdate"
              switch
              size="sm"
              class="text-secondary"
            >
              <b-icon-calendar />
              Manual Note Date
            </b-form-checkbox>
            <div v-show="backdate">
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="my-0"
              >
                <template v-slot:label>
                  Note Date
                </template>
                <b-form-datepicker
                  v-model="noteDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                  size="sm"
                />
              </b-form-group>
            </div>
          </b-card>
          <template v-slot:footer>
            <b-btn-group class="w-100 d-flex">
              <span :id="!isValid ? 'incomplete-fields' : 'save-btn'" class="w-100 d-flex">
                <b-btn
                  @click="onSubmit"
                  :disabled="!isValid"
                  :variant="isValid ? 'secondary' : 'outline-secondary'"
                  class="roman flex-grow-1 btn-rad"
                >
                  <b-icon-bookmark-plus />
                  Save Note
                </b-btn>
                <b-tooltip
                  target="incomplete-fields"
                  triggers="hover"
                  placement="bottom"
                  variant="secondary"
                >
                  Complete Required Fields
                </b-tooltip>
              </span>
              <b-btn
                id="reset"
                @click="onReset"
                variant="outline-tertiary"
                class="ml-1 btn-rad px-2 roman flex-grow-0"
              >
                <b-icon-trash />
              </b-btn>
            </b-btn-group>
          </template>
          <b-alert
            :show="dismissCountDown"
            @dismissed="dismissCountDown = 0"
            @dismiss-count-down="countDownChanged"
            id="submission-status"
            variant="success"
            dismissible
          >
            <b-icon-check-circle />
            Note Saved!
          </b-alert>
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
  Placeholder
} from 'tiptap-extensions'
import HubHelpers from '../hub-helpers'
export default {
  components: {
    VueMultiselect,
    EditorContent,
    EditorMenuBar
  },
  mixins: [HubHelpers],
  data () {
    return {
      editor: null,
      showLocation: false,
      showDates: false,
      backdate: false,
      theme: 'secondary',
      client: null,
      clientLocations: [],
      detectedClient: false,
      isBusy: false,
      autoIsBusy: false,
      noteDate: new Date(),
      startDate: null,
      endDate: null,
      locations: [],
      isInternal: true,
      promoted: false,
      annotation: {
        html: '',
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
      team: 'da',
      teams: [
        { text: 'Digital Advertising', value: 'da' },
        { text: 'SEO', value: 'seo' },
        { text: 'Customer Care', value: 'cc', disabled: true }
      ],
      category: 'None',
      categories: {
      null: [
        { text: 'Select a Team First', value: 'None' }
      ],
      da: [
        { text: 'Select Option', value: 'None' },
        { text: 'Account Changes', value: 'Account Changes' },
        { text: 'Customer Contact', value: 'Customer Contact' },
        { text: 'General Note', value: 'General Note' },
        { text: 'Optimizations', value: 'Optimizations' },
        { text: 'Other', value: 'Other' },
        { text: 'Technical Issue', value: 'Technical Issue' }
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        { text: 'Account Changes', value: 'Account Changes' },
        { text: 'Account Audit', value: 'Account Audit' },
        { text: 'Customer Contact', value: 'Customer Contact' },
        { text: 'General Note', value: 'General Note' },
        { text: 'Optimizations', value: 'Optimizations' },
        { text: 'Other', value: 'Other' },
        { text: 'Technical Issue', value: 'Technical Issue' }
      ],
      cc: []
    },
    actionType: 'None',
    actionTypes: {
      null: {
        da: [
          { text: 'Select a Category First', value: 'None' }
        ],
        seo: [
          { text: 'Select a Category First', value: 'None' }
        ],
        cc: [
          { text: 'Select a Category First', value: 'None' }
        ]
      },
      None: {
        da: [
          { text: 'Select a Category First', value: 'None' }
        ],
        seo: [
          { text: 'Select a Category First', value: 'None' }
        ],
        cc: [
          { text: 'Select a Category First', value: 'None' }
        ]
      },
      'Account Audit': {
        da: [],
        seo: [
          { text: 'Select Option', value: 'None' },
          'Site Health Check',
          'SEO Audit',
          'Performance Analysis',
          'Client Recommendation'
        ],
        cc: []
      },
      'Account Changes': {
        da: [
          { text: 'Select Option', value: 'None' },
          'Smart Bidding Strategy Change',
          'Specials/Promotions',
          'Spend Optimizer Version Change',
          'URL Change',
          'Whitelisting Events Change'
        ],
        seo: [
          { text: 'Select Option', value: 'None' },
          'Service Upgrade',
          'Service Downgrade',
          'Business Information'
        ],
        cc: [
          { text: 'Select Option', value: 'None' }
        ]
      },
      'General Note': {
        da: [{ text: 'None', value: 'None' }],
        seo: [{ text: 'None', value: 'None' }],
        cc: [{ text: 'None', value: 'None' }]
      },
      'Customer Contact': {
        da: [
          { text: 'Select Option', value: 'None' },
          'Action Items',
          'Analysis/Notes'
        ],
        seo: [
          { text: 'Select Option', value: 'None' },
          'Action Items',
          'Analysis/Notes',
          'User Access'
        ],
        cc: [
          { text: 'Select Option', value: 'None' }
        ]
      },
      Optimizations: {
        da: [
          { text: 'Select Option', value: 'None' },
          'Added Negative Keywords',
          'Added Keywords',
          'Changed Location Strategy',
          'Updated Geographic Targeting',
          'Updated Audiences',
          'Paused Campaign',
          'Enabled Campaign',
          'Refreshed Ad Copy',
          'Testing',
          'T&O Added',
          'Manual Spend Adjustments',
          'Manual Bid Adjustments'
        ],
        seo: [
          { text: 'Select Option', value: 'None' },
          'Keyword Strategy Update',
          'Website - Content',
          'Website - Technical',
          'GMB'
        ],
        cc: [{ text: 'Select Option', value: 'None' }]
      },
      Other: {
        da: [
          { text: 'Select Option', value: 'None' },
          'Uncontrollable Circumstances'
        ],
        seo: [{ text: '-', value: 'None' }],
        cc: [{ text: '-', value: 'None' }]
      },
      'Technical Issue': {
        da: [
          { text: 'Select Option', value: 'None' },
          'DA WoW',
          'Dynamic Pricing',
          'Dynamic Availability',
          'Reporting Issue',
          'DAM - Account Selection',
          'DAM - Sitelink Selection',
          'DAM - Campaign/Ad Group Selection'
        ],
        seo: [
          { text: 'Select Option', value: 'None' },
          'Website',
          'GMB',
          'Business Listings',
          'Reporting Issue'
        ],
        cc: [{ text: 'Select Option', value: 'None' }]
      }
    },
      isInternal: true,
      dismissSecs: 2,
      dismissCountDown: 0,
    }
  },
  mounted() {
    chrome.storage.sync.get('team', (res) => {
      if (res.team) {
        this.team = res.team
      } else {
        this.team = 'da'
      }
    })
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
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Write something …',
          showOnlyWhenEditable: true
        }),
      ],
      content: this.annotation.html,
      onUpdate: ({ getHTML, getJSON }) => {
        this.updateText({ html: getHTML(), json: getJSON() })
      }
    })
    this.autoDetect()
  },
  computed: {
    ...mapState({
      clients: state => state.clients
    }),
    hasToken() {
      return this.$store.getters.hasToken
    },
    isValid() {
      return this.category !== 'None' && this.client !== null
    },
    categoryInvalid() {
      return (this.category !== null)
        ? ''
        : 'Category is required.'
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    toggleDates(evt) {
      const matches = [
        'Specials/Promotions',
        'Testing',
        'Uncontrollable Circumstance',
        'DA WoW',
        'Other',
        'Dynamic Pricing',
        'Dynamic Availability'
      ]
      this.showDates = matches.includes(evt)
    },
    onReset() {
      this.client = null
      this.locations = []
      this.isInternal = true
      this.promoted = false
      this.showAlert = true
      this.team = 'da'
      this.category = 'None'
      this.actionType = 'None'
      this.autoDetect = false
      this.isBusy = false
      this.autoIsBusy = false
      this.editor.clearContent()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    onMessage() {
      chrome.runtime.onMessage.addListener((req, sender, res) => {
        console.log({ req })
        if (req.msg === 'update-ui') {
          this.detectedClient = req.data.hasOwnProperty('client')
          this.client = (req.data.client)
            ? req.data.client
            : this.client
          this.clientLocations = (req.data.locations.length > 0)
            ? req.data.locations
            : []
          this.locations = (req.data.selectedLocations)
            ? req.data.selectedLocations
            : []
          this.autoIsBusy = false
          this.isBusy = false
          res(200)
          return
        } else if (req.msg === 'not-found') {
          this.autoIsBusy = false
          this.detectedClient = false
          this.isBusy = false
          res(400)
          return
        }
      })
    },
    autoDetect(manual = false) {
      this.onMessage()
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, (tabs) => {
        this.autoIsBusy = true
        const url = tabs[0].url
        chrome.runtime.sendMessage({
          msg: 'auto-detect',
          url,
          manual
        }, (res) => {
          if (res.client) {
            this.client = res.client
            this.detectedClient = true
          }
          if (res.locations) {
            this.clientLocations = res.locations
          }
          if (res.selectedLocations) {
            this.locations = res.selectedLocations
          }
          this.autoIsBusy = false
          this.isBusy = false
        })
      })
    },
    refreshClients() {
      this.isBusy = true
      chrome.runtime.sendMessage({
        msg: 'reload-clients'
      }, () => {
        this.client = null
        this.clientLocations = []
        this.locations = []
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
          promoted: this.promoted,
          locationUrns: this.locations.map(l => l.urn),
          category: this.category,
          actionType: this.actionType,
          html: this.annotation.html,
          annotation: this.annotation.json,
          startDate: this.startDate,
          endDate: this.endDate,
          createdAt: this.noteDate,
          teamId: this.team === 'da' ? 1 : 2
        }
      }, () => {
        this.client = null
        this.locations = []
        this.team = 'da'
        this.category = 'None'
        this.actionType = 'None'
        this.detectedClient = false
        this.isInternal = true
        this.promoted = false
        this.isBusy = false
        this.startDate = null
        this.endDate = null
        this.editor.clearContent()
        this.showAlert()
      })
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
      }, (res) => {
        console.log({ res })
        if (res.locations) {
          this.clientLocations = res.locations
        }
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
.btn-rad {
  border-radius: 5px;
}
.alert-anchor {
  position: relative;
  & #submission-status {
    position: absolute;
    width: 75%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0px 5px 15px rgba(12, 35, 63, 0.2),
                0px 10px 20px rgba(12, 35, 63, 0.2);
  }
}
.editor {
  &__content {
    font-size: 0.9em;
    padding: 0.5em 0.5em 0.25em;
    border: 1px solid #7898ad;
    border-top: none;
    color: #0b233f;
    & .is-editor-empty:first-child::before {
      content: attr(data-empty-text);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
      font-style: italic;
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
