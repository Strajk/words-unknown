import optionsStorage from './options-storage';

const TAG = 'mark'
const CLASSNAME = "__words-unknown"
const CLASSNAME_CAPITALIZED = "capitalized"
const CLASSNAME_ADDED = "added"
const SELECTOR = `${TAG}.${CLASSNAME}`;

let currKey

;(async () => {
  const options = await optionsStorage.getAll();

  const style = `
    ${TAG}.${CLASSNAME} {
      background-color: ${options.colorUnknown};
      cursor: pointer;
    }
    ${TAG}.${CLASSNAME}.${CLASSNAME_CAPITALIZED} {
      background-color: transparent;
      outline: 1px dotted ${options.colorUnknown};
    }
    ${TAG}.${CLASSNAME}.${CLASSNAME_ADDED} {
      background-color: ${options.colorAdded} !important;
      outline: none !important;
      cursor: inherit;
    }
  `;

  await injectCss(style) // TODO: Once

  const { dict = [] } = await browser.storage.local.get("dict")

  document.addEventListener("click", await handlerClick)
  document.addEventListener("keydown", ev => { currKey = ev.key });
  document.addEventListener("keyup", ev => { currKey = null });

  const root = document.body
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT /* whatToShow */);

  let node;

  // TODO: Do in once loop, but beware of mutation
  const nodes = []
  while (node = walker.nextNode()) {
    nodes.push(node)
  }

  for (let node of nodes) {
    const text = node.textContent
    const words = (text.match(/\b(\w+)\b/g) || []).filter(x => x.length > 2) // TODO: parametrize

    let rest = node
    words.forEach((word, index) => {
      if (dict.includes(word.toLowerCase())) return;

      const l = rest.textContent.indexOf(word)
      const match = rest.splitText(l)
      rest = match.splitText(word.length)
      const el = document.createElement(TAG);
      el.classList.add(CLASSNAME);
      if (word.charAt(0) === word.charAt(0).toUpperCase()) el.classList.add(CLASSNAME_CAPITALIZED)
      el.textContent = match.textContent;
      node.parentNode.replaceChild(el, match);
    })
  }
})()

async function handlerClick(ev) {
  const el = ev.target
  if (!el.matches(SELECTOR)) return

  const text = el.innerText;

  if (ev.metaKey) return // TODO: Test on windows

  switch (currKey) {
    case "d":
      ev.preventDefault()
      window.open(`https://www.google.com/search?q=dictionary#dobs=${text}`)
      break
    default:
      ev.preventDefault()
      await addToDict(text)
  }
}

async function addToDict(word) {
  const { dict = [] } = await browser.storage.local.get("dict");
  dict.push(word.toLowerCase())
  await browser.storage.local.set({ dict })

  Array.from(document.querySelectorAll(`${SELECTOR}:not(.${CLASSNAME_ADDED})`))
    .filter(el => el.innerText.toLowerCase() === word.toLowerCase())
    .forEach(el => el.classList.add(CLASSNAME_ADDED))
}

function injectCss (content) {
  const el = document.createElement("style")
  el.innerHTML = content
  document.head.appendChild(el)
}
