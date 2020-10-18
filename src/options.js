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
  }, 250) // TODO: Better
});
