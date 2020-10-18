> Learn English while browsing the web by highlighting words that you don't know yet.

⚠️ **Work in progress**, current version is a pure MVP

## How to use

- Click on extension icon to activate it
- Extension will parse the website and highlight words you don't have in your dictionary
- Click on highlighted words to add them to the dictionary
  - If the highlight is part of the link, hold <kbd>cmd</kbd> key while clicking to open the link instead of adding the word.
  - Hold the <kbd>d</kbd> key while clicking to open the dictionary instead of adding the word.

### Features (and future futures)

- Customizable highlight colors
- Capitalized words are subtly outlined instead of highlighted with background color
- Dictionary presets

#### Planned (contributions welcome 🙏)

- Add "n" most frequend words
  - http://norvig.com/mayzner.html
  - https://pastebin.com/anKcMdvk
  - https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#Project_Gutenberg
  - https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists
- Optimize permissions
- Click on added to remove
- Customizable everything
- Matching by stem (optional)
  - [github.com/words/stemmer](https://github.com/words/stemmer)
- Optimized data structure for storing dictionary
  - [github.com/zandaqo/structurae](https://github.com/zandaqo/structurae)
  - [johnresig.com/blog/javascript-trie-performance-analysis/](https://johnresig.com/blog/javascript-trie-performance-analysis/)
- Undo/Redo
- History
- Root element selection
- Dictionary export/import
- Dictionary backup
- Open in dictionary
- Turning on/off
- Option to ignore name-like words
- Option to ignore abbreviations

### About the name

Word play on amazing [Anthony Bourdain's Parts Unknown](https://en.wikipedia.org/wiki/Anthony_Bourdain:_Parts_Unknown)

### Tech stack notes

- Options UI
  - [github.com/alpinejs/alpine](https://github.com/alpinejs/alpine) – wanted to try it out, it did it's job, but I would use Vue next time.

### Attributions

- Presets / Familiar words
  - [github.com/words/spache](https://github.com/words/spache)
  - [github.com/words/dale-chall](https://github.com/words/dale-chall)
