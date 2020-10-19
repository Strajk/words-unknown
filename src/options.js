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

    download: async function () {
      const { dict = [] } = await browser.storage.local.get("dict");
      const text = dict.join("\n");
      const timestamp = new Date().toISOString().substr(0, 19).replace("T", " "); // "2020-10-19T06:21:38.740Z" -> ""2020-10-19 06:21:38""
      download(text, `words-unknown-export-${timestamp}`)
    },

    async init() {
      const { dict = [] } = await browser.storage.local.get("dict");
      this.$refs.dict.value = dict.join("\n");
    }
  }
}


// Inspired by https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
function download(data, filename) {
  const blob = new Blob([data], {type: 'text/plain;charset=UTF-8'});
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }

  document.body.appendChild(tempLink);
  tempLink.click();

  // Fixes "webkit blob resource error 1"
  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 200)
}
