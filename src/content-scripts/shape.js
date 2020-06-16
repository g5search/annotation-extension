(function() {
  const urn = document.querySelector('.id-map-wrapper > div > small > code').innerText
  chrome.runtime.sendMessage({
    msg: 'shape-urn',
    data: { urn }
  })
})()
