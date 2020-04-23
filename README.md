# annotation-extension

Chrome extension for G5's COPS Annotation Service.

## Getting Started

> *These instructions presume you have a working Node.js environment.*

> See Appendix for one way to get up and running with Node.

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
- Navigate to [chrome://extensions/](chrome://extensions/).
- Enable Developer Mode.
- Click Load Unpacked and navigate to this repo's `dist/` directory.
- Use 'Inspect Background Page' to view console for background process.

### Publish to Chrome Store

> TODO: joining developer Google group. Registering with Chrome Store and access to Google Payments (for managed Google accounts).


### Contributing

> TODO: pull requests, features and feedback, contributers.

We do expect this to have a decent install base for internal teams. This configuration let's you keep the Extension installed and loaded.

1. Update current branch.
``` bash
cd annotation-service
git pull
```
2. Install additional dependencies.
``` bash
npm i
```
3. Start the Development Server.
``` bash
npm run watch:dev
```

### Helpful Links

[Chrome Extension Getting Started](https://developer.chrome.com/extensions/getstarted)

[Vue Extention Boilerplate](https://github.com/Kocal/vue-web-extension)

### Appendix: Node.js on macOS

There are lots of ways to install Node.js on a Mac, but this way works well with our G5's user management. These are command line entries.

1. Install [Homebrew](https://brew.sh/) (requires admin privileges).
2. Use brew to install NVM (Node Version Manager).
``` bash
brew install nvm
```
3. Configure NVM using post-install instructions to create `./nvm` home folder and source nvm commands.
``` bash
mkdir ~/.nvm

# Edit your bash env using nano or vim
nano ~/.bash_profile

# Paste the following in your profile file
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Save ^O, then Exit ^X
# Source your profile file
source ~/.bash_profile
```
4. Use NVM to install LTS of Node.js (Must be Node 10 or newer).
``` bash
nvm install --lts
```
5. Return to Getting Started instructions.
