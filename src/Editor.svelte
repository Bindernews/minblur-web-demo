<script>
  import {basicSetup} from '@codemirror/basic-setup';
  import {EditorState, Compartment} from '@codemirror/state';
  import {EditorView, keymap} from '@codemirror/view';
  import {indentWithTab} from '@codemirror/commands';

  /** Document text (set-only)
   * @type {string} */
  export let document = "";
  /** Determine if the editor is read-only or not
   * @type boolean */
  export let readOnly = false;
  /** Additional editor extensions
   * @type Array */
  export let extensions = [];

  /** @type EditorView */
  let view;

  let mutReadOnly = new Compartment;

  let editorState = EditorState.create({
    doc: document,
    extensions: [
      mutReadOnly.of(EditorState.readOnly.of(readOnly)),
      EditorState.allowMultipleSelections.of(true),
      EditorState.tabSize.of(2),
      basicSetup,
      keymap.of([indentWithTab]),
      extensions,
    ]
  });

  $: {
    setText(document);
  }

  /** @return {EditorView} */
  export function getView() {
    return view;
  }

  /**
   * Sets the document text, bypassing `readOnly`
   * @param {string} text
   */
  export function setText(text) {
    if (view) {
      const docLen = view.state.doc.length;
      view.dispatch(
        { effects: mutReadOnly.reconfigure(EditorState.readOnly.of(false)) },
      );
      view.dispatch({ 
          effects: mutReadOnly.reconfigure(EditorState.readOnly.of(readOnly)),
          changes: view.state.changes({ from: 0, to: docLen, insert: text })
      });
    }
  }

  /**
   * @param node {HTMLDivElement}
   */
  function createView(node) {
    view = new EditorView({
      state: editorState,
      parent: node,
    });
    return {
      destroy() {
        view.destroy()
      }
    };
  }

</script>

<div class="editor-parent" use:createView></div>

<style>
  .editor-parent {
    height: 100%;
  }
  .editor-parent > :global(.cm-editor) {
    height: 100%;
  }
</style>
