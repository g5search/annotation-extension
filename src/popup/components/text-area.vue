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
        <!-- <b-btn
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
        </b-btn> -->
        <div class="menubar__spacer bg-secondary" />
        <b-btn
          :class="[{ 'is-active': isActive.link() }, 'menubar__btn']"
          @click="commands.link"
          variant="outline-secondary"
        >
          <b-icon-link45deg />
        </b-btn>
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
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Focus,
  Placeholder,
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
  props: ['theme', 'content'],
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
        new History(),
        new Focus({
          className: 'has-focus',
          nested: true
        }),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Enter your note here...',
          showOnlyWhenEditable: true
        })
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
    padding: 0.25em 0.5em;
    border: 1px dotted red;
  }
  & .menubar {
    margin-bottom: 0.75em;
    // box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    transition: 200ms ease-out;
    display: flex;
    // &:hover {
    //   // box-shadow: 0 5px 7px rgba(0, 0, 0, 0.5);
    // }
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
