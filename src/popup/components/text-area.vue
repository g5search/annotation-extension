<template>
  <div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
export default {
  components: {
    EditorContent
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is editor content.</p><p>click to edit</p>'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
