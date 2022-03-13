<script>
  import Editor from './Editor.svelte';
  import {EditorView} from '@codemirror/basic-setup';
  import onChangeExtension from './OnChangeExtension';
  import { CompilerApi, default as init } from 'minblur/minblur_wasm';
  import minblurWasm from 'minblur/minblur_wasm_bg.wasm';
  import { writable } from 'svelte/store';

  const DEMO_TEXT = "# Minblur live demo!\n  set i 1\nloop:\n  op add i i 1\n"
    + "  m! jump (i % 1000 > 0) loop\n  print i\n  printflush message1\n  m! jump loop";

  const inputText = writable("");
  const outputText = writable("");
  let compilerReady = writable(false);
  
  async function loadCompiler() {
    const wasm = await minblurWasm();
    await init(wasm);
    compilerReady = true;
    inputText.set(DEMO_TEXT);
  };
  loadCompiler();
  
  const changeExt = onChangeExtension(1, (state) => {
    if (!compilerReady) {
      return;
    }
    const compiler = CompilerApi.create();
    try {
      const codeIn = state.sliceDoc();
      const codeOut = compiler.compile("example.mblur", codeIn);
      outputText.set('Ok:\n' + codeOut);
    } catch (e) {
      console.error(e);
      const errors = JSON.parse(e);
      outputText.set('Errors:\n' + errors.join('\n'));
    }
  })

  const lineWrapExt = EditorView.lineWrapping;

</script>

<div class="container">
  <div class="g-banner">
    Minblur Live Demo
  </div>
  <div style="grid-area: 2/1/2/1">
    Editor
  </div>
  <div class="g-edit">
    <Editor document={$inputText} extensions={[changeExt]} />
  </div>
  <div style="grid-area: 2/3/2/3">
    Output
  </div>
  <div class="g-output">
    <Editor document={$outputText} readOnly={true} extensions={[lineWrapExt]} />
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
    font-size: 1.2em;
    margin: 0.5em 0 0.5em 0;
    font-weight: bold;
  }
  .g-edit {
    grid-column: 1;
    grid-row: 3;
  }
  .g-output {
    grid-column: 3;
    grid-row: 3;
  }
  :global(body) {
    margin: 0;
  }
  :global(*) {
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
  }
  :global(html) {
    font-family: sans-serif;
  }
</style>
