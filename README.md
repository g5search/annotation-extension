# annotation-extension

Chrome extension for G5's COPS Annotation Service.

## Getting Started

1. Clone this repo.
``` bash
git clone https://github.com/pcktbot/annotation-extension.git
```
2. Install dependencies.
``` bash
cd annotation-extension
npm i
```
3. Run Development Server
``` bash
npm run watch:dev
# or without hot-reload on background scripting
npm run build:dev
```
4. Load Dev Extension in Chrome.
- Navigate to [Chrome Extensions](chrome://extensions/).
- Enable Developer Mode.
- Click Load Unpacked and navigate to this repo's `dist/` directory.
- Use 'Inspect Background Page' to view console for background process.

## Helpful Links

[Chrome Extension Getting Started](https://developer.chrome.com/extensions/getstarted)
[Vue Extention Boilerplate](https://github.com/Kocal/vue-web-extension)
