import 'alpinejs'
import optionsStorage from './options-storage';
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
    saveDict: async function (ev) {
      const dict = ev.target.value.split("\n").filter(x => x.length)
      await browser.storage.local.set({ dict })
    },

    async init() {
      const { dict = [] } = await browser.storage.local.get("dict");
      this.$refs.dict.value = dict.join("\n");
    }
  }
}
