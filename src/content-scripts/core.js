(function() {
  const url = document.querySelector('#clientcentermenu > div > ul.first-of-type > li:nth-child(1) > a').href;
  const regex = /https:\/\/www.g5search.com\/admin\/clients\/(\d*)\/edit$/
  const clientId = url.match(regex) ? url.match(regex)[1] : ''
  chrome.runtime.sendMessage({
    msg: 'core',
    data: { clientId }
  });
})();
