# /src

```
|_ icons/ # icon files for extensions menu, chrome store, and address-bar
|_ options/ # UI for Options Menu at chrome://extensions (Vue)
|_ popup/ # UI for Popup (Vue)
|_ store/ # Vuex Store (Vue)
|_ background.js
|_ manifest.json
```

Root of Chrome Extension. Both popup and background have access to Vuex as well as the Storage API, which are both used to hydrate user data.

## Todos

- [ ] Are we going to be able to persist any data in the extenion?
- [ ] What are the limits of the chrome storage sync?
- [ ] What is the benefit of using Vuex in this context?