const host = 'https://notes.g5marketingcloud.com'

const pageMap = {
  ['https:\\/\\/www.g5search.com\\/admin\\/services\\?id=(\\d*)$']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/core/client/`,
    selectLocation: false
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/services$']: {
    functionName: 'injected',
    file: './content-scripts/core.js'
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/clients\\/list_stores']: {
    functionName: 'injected',
    file: './content-scripts/core.js'
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/services\\/details\\/(\\d*)\\/(\\d*)$']: {
    functionName: 'fromUrl',
    group: 2,
    host: `${host}/api/core/location/`,
    selectLocation: true
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/services\\/edit\\/(\\d*)$']: {
    functionName: 'fromUrl',
    group: 1,
    host: `https://notes.g5marketingcloud.com/api/core/services/`,
    selectLocation: true
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/clients\\/(\\d*)\\/edit']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/core/client/`,
    selectLocation: false
  },
  ['https:\\/\\/www.g5search.com\\/admin\\/clients\\/edit_store\\?id=(\\d*)$']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/core/location/`,
    selectLocation: true
  },
  ['https:\\/\\/hub\\.g5marketingcloud\\.com\\/admin\\/clients\\/(\\S*)\\/locations\\/(\\S*)\\/edit$']: {
    functionName: 'populateClientAndLoc'
  },
  ['https:\\/\\/hub\\.g5marketingcloud\\.com\\/admin\\/clients\\/(\\S*)\\/locations$']: {
    functionName: 'populateClient'
  },
  ['https:\\/\\/hub\\.g5marketingcloud\\.com\\/admin\\/clients\\/(\\S*)$']: {
    functionName: 'populateClient'
  },
  ['https:\\/\\/call-tracking\\.g5marketingcloud\\.com\\/admin\\/clients\\/(\\S*)\\/locations\\/(\\S*)\\/pooling_location_phone_numbers']: {
    functionName: 'populateClientAndLoc'
  },
  ['https:\\/\\/call-tracking\\.g5marketingcloud\\.com\\/admin\\/clients\\/(\\S*)\\/locations']: {
    functionName: 'populateClient'
  },
  ['https\\:\\/\\/ui\\.ads\\.microsoft\\.com\\/campaign\\/Campaigns\\?\\S*#customer\\/\\S*\\/account\\/(\\d*)\\/overview']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/v1/microsoft/account/`,
    selectLocation: false
  },
  ['https:\\/\\/business\\.facebook\\.com\\/adsmanager\\/manage\\/all\\?\\S*act=(\\d*)\\S*']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/v1/facebook/account/`,
    selectLocation: false
  },
  ['https:\\/\\/business\\.facebook\\.com\\/adsmanager\\/manage\\/all\\?\\S*selected_campaign_ids=(\\d*)&root_level=ad_set']: {
    functionName: 'fromUrl',
    group: 1,
    host: `${host}/api/v1/facebook/account/`,
    selectLocation: false
  },
  ['https:\\/\\/ads.google.com\\/.*$']: {
    functionName: 'injected',
    file: './content-scripts/google-ads.js'
  },
  ['https:\\/\\/shape.io\\/(.*)']: {
    functionName: 'injected',
    file: './content-scripts/shape.js'
  }
}

export { pageMap }
