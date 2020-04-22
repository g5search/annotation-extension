# popup/router/pages

Create page-level templates as single-file Vue components. Then add path to `popup/router/routes.js` for Vue-Router.

## Example
for a file named `/popup/router/pages/new-page.vue`, the entry in `routes.js` would be:
```js
import NewPage from './pages/new-page'

export default [
// ...
  {
    path: '/new-page',
    component: NewPage
  },
// etc...
]
```

## Plugins

Global plugins can be imported and registered through `popup/router/index.js`.

> (2020-04-21) Not sure yet how I'm going to handle component files.
