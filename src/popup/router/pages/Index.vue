<template>
  <b-container fluid class="p-3">
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
          <b-btn
            v-b-toggle.sidebar-1
            variant="outline-primary"
            class="flex-grow-0 px-2"
          >
            <b-icon-three-dots-vertical />
          </b-btn>
        </b-btn-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card no-body>
          <b-tabs card>
            <b-tab>
              <template v-slot:title>
                <b-icon-search />
              </template>
              <b-form>
                <b-form-group
                  label="Client"
                >
                  <b-form-select
                    id="client-select"
                    v-model="client"
                    :options="clients"
                  />
                </b-form-group>
              </b-form>
            </b-tab>
            <b-tab>
              <template v-slot:title>
                <b-icon-textarea />
              </template>
              <editor-content :editor="editor" />
            </b-tab>
          </b-tabs>
          <template v-slot:footer>
            <b-btn @click="getClients">
              Get Clients
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
export default {
  components: {
    EditorContent
  },
  data () {
    return {
      version,
      client: null,
      clients: [],
      editor: null
    }
  },
  computed: {
    all() {
      return this.$store.state
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is editor content.</p>'
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    getClients() {
      chrome.storage.sync.get('color', (data) => {
        this.msg = `Storage Color: ${data.color}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
