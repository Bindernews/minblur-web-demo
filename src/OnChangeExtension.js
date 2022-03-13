import { EditorState } from "@codemirror/basic-setup";
import { ViewUpdate, ViewPlugin } from "@codemirror/view";

/**
 * @callback DocChangeCallback
 * @param {EditorState} state
 * @returns {void}
 */

/**
 * 
 * @param {number} timeout Seconds to delay before firing callback
 * @param {DocChangeCallback} cb
 * @returns {ViewPlugin}
 */
export default function callbackOnDocChange(timeout, cb) {
  return ViewPlugin.fromClass(class {
    constructor(_view) {
      this.dom = null;
      this.timerId = 0;
    }

    /**
     * @param {ViewUpdate} update 
     */
    update(update) {
      if (update.docChanged) {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(cb, timeout * 1000, update.state);
      }
    }
  });
}