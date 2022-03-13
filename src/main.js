import App from './App.svelte';

const app = new App({
    target: document.body,
});

export default app;

window.resolve_path = function(base, path) { return null; }
window.fs_read_to_string = function(path) { return null; }
