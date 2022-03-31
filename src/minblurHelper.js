
import { CompilerApi, default as init } from 'minblur/minblur_wasm';
import minblurWasm from 'minblur/minblur_wasm_bg.wasm';

/** @type boolean */
let compilerReady = false;

export async function initMinblur() {
  const wasm = await minblurWasm();
  await init(wasm);
  compilerReady = true;
};

/**
 * @returns {CompilerApi|null}
 */
export function newCompiler() {
  if (compilerReady) {
    return CompilerApi.create();
  } else {
    return null;
  }
}
