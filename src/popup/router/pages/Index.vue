<template>
  <b-container fluid class="p-1">
    <b-row>
      <b-col>
        <b-card no-body footer-class="p-0">
          <b-tabs
            v-model="tabSelected"
            card
          >
            <b-tab
              v-for="tab in tabs"
              :key="`tab-${tab}}`"
              class="p-0"
            >
              <template v-slot:title>
                <div class="close-container">
                  <b-spinner v-if="isBusy" small />
                  <b-icon-file-text v-else />
                  {{ tab }}
                  <b-btn
                    @click="onClose(tab)"
                    size="sm"
                    variant="outline-tertiary"
                    class="close-tab"
                  >
                    <b-icon-x />
                  </b-btn>
                </div>
              </template>
              <b-btn
                v-b-toggle="`${tab}-collapse`"
                variant="outline-secondary"
                class="px-5"
              >
                Clients
              </b-btn>
              <b-collapse
                :id="`${tab}-collapse`"
              >
                <client-selector />
              </b-collapse>
              <da-note :tab="tab" :clients="clients" />
            </b-tab>
            <template v-slot:tabs-end>
              <b-nav-item
                role="presentation"
                @click.prevent="newTab"
                class="add-btn"
              >
                <b-icon-plus />
              </b-nav-item>
            </template>
            <template v-slot:empty>
              <div class="text-center text-muted">
                There are no open notes.<br>
                Create a new note using the <b>+</b> button above.
              </div>
            </template>
          </b-tabs>
          <template v-slot:footer>
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
import DaNote from '../../components/da-note'
import ClientSelector from '../../components/client-selector'
export default {
  components: {
    DaNote,
    ClientSelector
  },
  data () {
    return {
      isBusy: false,
      tabs: [],
      tabCounter: 0,
      tabSelected: 1,
      // client: null,
      // clients: [],
      res: []
    }
  },
  computed: {
    all() {
      return this.$store.state
    }
  },
  methods: {
    newTab() {
      chrome.storage.sync.set({
        tabCounter: this.tabCounter
      }, (res) => console.log({ res }))
      this.tabs.push(this.tabCounter++)
    },
    onClose(x) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.tabs.splice(i, 1)
        }
      }
    },
    getClients() {
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
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
