const red = '#e61938'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: red }, () => {
    console.log('%c 🧶 The color is cherry red.', `color: ${red};`)
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'opex.g5marketingcloud.com' }
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})
