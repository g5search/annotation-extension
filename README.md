# annotation-extension

Chrome extension for G5's COPS Annotation Service.

## Getting Started

> *These instructions presume you have a working Node.js environment.*

1. Clone this repo in your favorite command line interface.
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

### Create Node Env on Mac OS.

There are lots of ways to do this, but this way works well with G5's user management.

1. Install [Homebrew](https://brew.sh/).
2. Use brew to install NVM (Node Version Manager).
3. Configure post install instructions to create `./nvm` home folder and source nvm commands.
4. Use NVM to install LTS of Node.js (Must be Node 10 or newer).
5. Return to Getting Started instructions.
