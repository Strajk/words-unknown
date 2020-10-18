import 'alpinejs'
import optionsStorage from './options-storage';
import presets from "./presets"

optionsStorage.syncForm('#options-form');

const colorInputs = [...document.querySelectorAll('.color-input input[type="text"]')];

function updateColor(input) {
  const parent = input.parentNode
  const colorPreview = parent.querySelector('.color-output');
  colorPreview.style.backgroundColor = input.value;
}

for (const input of colorInputs) {
  input.addEventListener('input', (ev) => updateColor(input));
}

window.addEventListener('load', () => {
  setTimeout(() => {
    for (const input of colorInputs) {
      updateColor(input)
    }
  }, 500) // TODO: Better, maybe with button
});

window.initialData = function () {
  return {
    log: "", // for easier debugging, use instead of console.log
    presets: Object.entries(presets),

    saveDict: async function (ev) {
      const dict = ev.target.value.split("\n").filter(x => x.length)
      await browser.storage.local.set({ dict })
    },

    usePreset: async function (key, replace) {
      const one = replace ? [] : (await browser.storage.local.get("dict")).dict || []
      const two = presets[key].words
      const dict = [...new Set([...one, ...two])]; // merge and uniq

      await browser.storage.local.set({ dict })
      this.$refs.dict.value = dict.join("\n");
    },

    async init() {
      const { dict = [] } = await browser.storage.local.get("dict");
      this.$refs.dict.value = dict.join("\n");
    }
  }
}
