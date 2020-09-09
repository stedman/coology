# Coology

Coology is a cross-browser extension that makes the [Schoology](https://app.schoology.com/) app a bit more enjoyable.

## Features

* themed colors for header, background, and footer
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

* `extension/themes.css` = each THEME in `.coology-THEME` and `[value="THEME"]` needs to match an input value below
* `extension/popup.html` = each input `value="THEME"` needs to match a class name and value above

The Schoology app is visually transformed by the `coology.css` stylesheet which imports themes via the CSS variables found in `themes.css`. The extension popup also draws its variables from `themes.css` via import.

### Pack for distribution

```sh
npm run pack
```
