<template>
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
        <div class="menubar__spacer bg-secondary" />
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
        <!-- <b-btn
          :class="[{ 'is-active': isActive.link() }, 'menubar__btn']"
          @click="commands.link"
          variant="outline-secondary"
        >
          <b-icon-link45deg />
        </b-btn> -->
        <!-- <b-btn
          :class="[{ 'is-active': isActive.undo() }, 'menubar__btn']"
          @click="commands.undo"
          variant="outline-primary"
        >
          <b-icon-arrow-counterclockwise />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.redo() }, 'menubar__btn']"
          @click="commands.redo"
          variant="outline-primary"
        >
          <b-icon-arrow-clockwise />
        </b-btn> -->
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" class="editor__content" />
  </div>
</template>

<script>
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
export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    theme: {
      type: String,
      default: 'primary'
    },
    content: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      editor: null
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
      content: this.content,
      onUpdate: ({ state, getHTML, getJSON, transaction }) => {
        this.$emit('text-update', { html: getHTML(), json: getJSON() })
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
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
      & .is-active {
        background-color: #7898ad;
        color: white;
      }
    }
  }
}
</style>
