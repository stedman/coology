# Coology

Coology is a cross-browser extension that makes the [Schoology](https://app.schoology.com/) app a bit more enjoyable.

## Features

* color themes
* iframe expander (inserts links to open iframe content to new tabs)

## Installation

### Chrome, Edge, Brave

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `coology/extension/` directory

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select the `coology/extension/` directory

## Development

### Edit themes

Color themes are at the core of Coology. The files to edit are:

* `extension/popup.html` = each input `value` needs to match a class name below
* `extension/themes.css` = each CLASSNAME in `.coology-CLASSNAME` needs to match an input value above

The Schoology app is visually transformed by the `coology.css` stylesheet which imports themes via the CSS variables found in `themes.css`.

To generate sample themes for the file extension popup, run the following script(s) to generate the CSS variable stylesheet that `popup.css` imports:

```sh
npm run css       # generate themesPopup.css from themes.css
npm run css-watch # watch themes.css for changes, then run script
```

### Pack for distribution

```sh
npm run pack
```
