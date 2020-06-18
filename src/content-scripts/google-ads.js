(function() {
  const codeAccount = document.querySelector('div.operating-customer > .id').innerText
  chrome.runtime.sendMessage({
    msg: 'google-ads',
    data: { codeAccount }
  })
})()
