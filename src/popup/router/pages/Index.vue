<template>
  <b-container fluid class="p-1">
    <b-sidebar
      id="sidebar-1"
      title="Options"
      right
      shadow
    >
      <b-card class="p-1">
        <template v-slot:header>
          Vuex Store
        </template>
        <code lang="json" class="d-block text-tertiary">
          {{ all }}
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
          variant="primary"
          class="flex-grow-0 px-2"
        >
          <b-icon-three-dots-vertical />
        </b-btn>
      </template>
    </menu-toolbar>
    <b-row>
      <b-col>
        <b-card no-body footer-class="p-0">
          <b-tabs card>
            <!-- <b-tab>
              <template v-slot:title>
                <b-icon-search />
              </template>
              <b-form-group
                label="Client"
              >
                <b-form-select
                  id="client-select"
                  v-model="client"
                  :options="clients"
                />
              </b-form-group>
              <code>
                {{ res }}
              </code>
            </b-tab> -->
            <b-tab>
              <template v-slot:title>
                <b-icon-file-text />
                Current
              </template>
              <b-form-group
                label="Note Type"
                label-cols="4"
                label-size="sm"
              >
                <b-form-select
                  v-model="type"
                  :options="types"
                  style="background: none;"
                />
              </b-form-group>
              <div class="p-1 mb-3 border border-secondary">
                <editor-content :editor="editor" />
              </div>
              <b-form-checkbox
                v-model="isInternal"
                size="sm"
                switch
              >
                Internal-Only
              </b-form-checkbox>
            </b-tab>
            <b-tab title-link-class="text-tertiary">
              <template v-slot:title>
                <b-icon-file-richtext />
                Draft
              </template>
              <da-note />
            </b-tab>
            <b-tab title-link-class="roman text-secondary">
              <template v-slot:title>
                <b-icon-plus />
              </template>
            </b-tab>
          </b-tabs>
          <template v-slot:footer>
            <b-btn @click="getClients" variant="primary">
              Action 1
            </b-btn>
            <b-btn @click="getClients" variant="tertiary">
              Action 2
            </b-btn>
            <b-btn @click="getClients" variant="quaternary" class="roman">
              Action 3
            </b-btn>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { version } from '../../../../package.json'
import { Editor, EditorContent } from 'tiptap'
import MenuToolbar from '../../components/menu-toolbar'
import DaNote from '../../components/da-note'
export default {
  components: {
    MenuToolbar,
    DaNote,
    EditorContent
  },
  data () {
    return {
      currentTab: { active: true, currentWindow: true },
      version,
      type: null,
      types: [
        'General Account Note',
        'Optimization',
        'Other'
      ],
      isInternal: false,
      client: null,
      clients: [],
      editor: null,
      res: []
    }
  },
  computed: {
    all() {
      return this.$store.state
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is editor content.</p><p>click to edit</p>'
    })
    chrome.tabs.query(this.currentTab, (tabs) => {
      const port = chrome.tabs.connect(tabs[0].id)
      port.postMessage({ counter: 1 })
      port.onMessage.addListener(res => this.onMessage(res))
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    onMessage(res) {
      this.res.push(res)
    },
    getClients() {
      chrome.runtime.getBackgroundPage()
      chrome.storage.sync.get('color', (data) => {
        this.res.push(`Storage Color: ${data.color}`)
      })
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        const tab = tabs[0]
        chrome.tabs.sendMessage(tab.id, { counter: 1 }, (res) => {
          this.res.push(res)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.roman {
  font-family:'Times New Roman', Times, serif;
  font-style: italic;
  font-weight: bold;
}
</style>
