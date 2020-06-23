(function() {
  const customerId = document.querySelector('div.external-customer-id').innerText;
  const codeAccount = (customerId)
    ? customerId
    : document.querySelector('div.operating-customer > .id').innerText;
  chrome.runtime.sendMessage({
    msg: 'google-ads',
    data: { codeAccount, customerId }
  });
})();
