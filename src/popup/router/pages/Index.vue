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
    <b-row>
      <b-col>
        <b-card no-body footer-class="p-0">
          <b-tabs card>
            <b-tab
              v-for="tab in tabs"
              :key="`tab-${tab}}`"
            >
              <template v-slot:title>
                <b-icon-file-text />
                Draft-{{ tab }}
                <b-btn
                  @click="onClose(tab)"
                  size="sm"
                  variant="transparent"
                >
                  <b-icon-x-circle />
                </b-btn>
              </template>
              <da-note :tab="tab" />
            </b-tab>
            <template v-slot:tabs-end>
              <b-nav-item
                role="presentation"
                @click.prevent="newTab"
              >
                <b-icon-plus />
              </b-nav-item>
            </template>
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
import DaNote from '../../components/da-note'
export default {
  components: {
    DaNote,
    EditorContent
  },
  data () {
    return {
      currentTab: { active: true, currentWindow: true },
      version,
      tabs: [],
      tabCounter: 2,
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
    newTab() {
      this.tabs.push(this.tabCounter++)
    },
    onClose(x) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.tabs.splice(i, 1)
        }
      }
    },
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
