<script>
  import Editor from './Editor.svelte';
  import TitleRow from './title/TitleRow.svelte';
  import { EditorView } from '@codemirror/basic-setup';
  import { callbackOnDocChange } from './editorExtensions';
  import { initMinblur, newCompiler } from './minblurHelper';
  import { writable } from 'svelte/store';

  const PROJECT_URL = "https://github.com/bindernews/minblur";
  const DEMO_TEXT = "# Minblur live demo!\n  set i 1\nloop:\n  op add i i 1\n"
    + "  m! jump (i % 1000 > 0) loop\n  print i\n  printflush message1\n  m! jump loop";

  let inputText = writable("");
  let statusPanel = writable({
    className: "",
    text: "",
  });

  /** @type {Editor} */
  let inputEditor
  /** @type {Editor} */
  let outputEditor
  
  // Load the compiler
  (async () => {
    await initMinblur();
    inputText.set(DEMO_TEXT);
  })();

  /**
   * @param {function(string):string} transformer
   */
  function transformCode(transformer) {
    try {
      const codeIn = inputEditor.getView().state.sliceDoc();
      const codeOut = transformer(codeIn);
      outputEditor.setText(codeOut);
      statusPanel.set({ className: "status-good", text: "Success" });
    } catch (e) {
      console.log(e);
      outputEditor.setText("" + e);
      statusPanel.set({ className: "status-error", text: "Error" });
    }
  }

  // Output line wrapping extension
  const lineWrapExt = EditorView.lineWrapping;
  // input extension that auto-compiles 1 second after input changes
  const changeExt = callbackOnDocChange(1, (_) => {
    transformCode((codeIn) => {
      const compiler = newCompiler();
      return compiler.compile("example.mblur", codeIn);
    });
  });

  // Have the compiler generate labels intead of compiling
  function actionGenerateLabels() {
    transformCode((codeIn) => {
      const compiler = newCompiler();
      return compiler.generate_labels("example.mblur", codeIn);
    })
  };
</script>

<div class="container">
  <div class="g-banner">
    <TitleRow>
      <div class="banner-text">Minblur Web Demo</div>
      <div class="spacer-h"></div>
      <a href={PROJECT_URL}>
        <img class="github-icon" src="./GitHub-Mark-64px.png" alt="GitHub Icon" />
      </a>
      <a href={PROJECT_URL}>
        Source
      </a>
    </TitleRow>
  </div>
  <div class="g-input g-title title-row">
    <TitleRow>
      <div class="title-text">Editor</div>
      <div class="spacer-h"></div>
      <div>
        <input 
          class="ghost-button btn-generate-labels"
          type="button"
          value="Generate Labels"
          on:click={() => actionGenerateLabels()}
        />
      </div>
    </TitleRow>
  </div>
  <div class="g-input g-editor">
    <Editor
      bind:this={inputEditor}
      document={$inputText}
      extensions={[changeExt]}
    />
  </div>
  <div class="g-output g-title title-row">
    <TitleRow>
      <div class="title-text">Output</div>
      <div class="status-panel {$statusPanel.className}">
        {$statusPanel.text}
      </div>
    </TitleRow>
  </div>
  <div class="g-output g-editor">
    <Editor
      bind:this={outputEditor}
      readOnly={true}
      extensions={[lineWrapExt]}
    />
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 10px minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr);
    width: calc(100vw - 8px);
    height: calc(100vh - 8px);
    padding: 4px;
  }
  .g-banner {
    grid-column: 1 / span 3;
    grid-row: 1;
  }
  .banner-text {
    font-size: 1.2em;
    margin: 0.5em 0 0.5em 0;
    font-weight: bold;
  }
  .g-input {
    grid-column: 1;
  }
  .g-title {
    grid-row: 2;
  }
  .g-editor {
    grid-row: 3;
  }
  .g-output {
    grid-column: 3;
  }
  .title-text {
    font-size: 1.1rem;
    padding-right: 1em;
  }
  .title-row {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .btn-generate-labels {
    padding: 2px 4px 2px 4px;
    font-size: 0.8em;
  }
  .ghost-button {
    background-color: transparent;
    border: 2px solid var(--col-primary);
    color: var(--col-text);
    border-radius: 2px;
    box-shadow: 0 1px 0 0 hsl(0deg 0% 100% / 40%)
  }
  .ghost-button:hover {
    transition: background-color 0.4s ease,
                color 0.4s ease;
    background-color: var(--col-primary);
    color: white;
  }
  .github-icon {
    max-height: 1.2em;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  .status-panel {
    font-size: 0.8em;
    min-width: 3em;
    background-color: var(--col-gray1);
    padding: 0.2em 0.6em 0.2em 0.6em;
  }
  .status-panel.status-good {
    background-color: var(--col-good);
  }
  .status-panel.status-error {
    background-color: var(--col-error);
  }

  :global(body) {
    margin: 0;
  }
  :global(body a) {
    color: var(--col-url);
    text-decoration: none;
  }
  :global(*) {
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
  }
  :global(html) {
    font-family: sans-serif;
    --col-primary: #13b65f;
    --col-second: #b6136a;
    --col-off1: #b6136a;
    --col-off2: #13b6b0;
    --col-triad1: #136ab6;
    --col-triad2: #5f13b6;
    --col-gray2: #E1E2E1;
    --col-gray1: #f5f5f6;
    --col-text: #000000;
    --col-error: #FF8A80;
    --col-good: #B9F6CA;
    --col-url: #4d76ae;
  }
</style>
