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
          variant="outline-primary"
        >
          <b-icon-type-bold />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.italic() }, 'menubar__btn']"
          @click="commands.italic"
          variant="outline-primary"
        >
          <b-icon-type-italic />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.heading({ level: 1 }) }, 'menubar__btn']"
          @click="commands.heading({ level: 1 })"
          variant="outline-primary"
        >
          <b-icon-type-h1 />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.heading({ level: 2 }) }, 'menubar__btn']"
          @click="commands.heading({ level: 2 })"
          variant="outline-primary"
        >
          <b-icon-type-h2 />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.heading({ level: 3 }) }, 'menubar__btn']"
          @click="commands.heading({ level: 3 })"
          variant="outline-primary"
        >
          <b-icon-type-h3 />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.strike() }, 'menubar__btn']"
          @click="commands.strike"
          variant="outline-primary"
        >
          <b-icon-type-strikethrough />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.ordered_list() }, 'menubar__btn']"
          @click="commands.ordered_list"
          variant="outline-primary"
        >
          <b-icon-list-ol />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.bullet_list() }, 'menubar__btn']"
          @click="commands.bullet_list"
          variant="outline-primary"
        >
          <b-icon-list-ul />
        </b-btn>
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" class="editor__content" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
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
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [1, 2, 3] }),
        new OrderedList(),
        new BulletList(),
        new ListItem(),
        new Bold(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History()
      ],
      content: '<p>🐙This is editor content.</p><p>click to edit</p>'
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
  }
  & .menubar {
    margin-bottom: 0.5em;
    &__btn {
      padding: 0.15em 0.25em;
      margin: 0;
      & .is-active {
        background-color: #0b233f;
        color: white;
      }
    }
  }
}
</style>
