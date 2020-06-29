(function() {
  let codeAccount, customerId;
  const exId = document.querySelector('div.external-customer-id');
  const opId = document.querySelector('div.operating-customer > .id');
  if (!opId) {
    codeAccount = '';
    // customerId = undefined;
  } else {
    if (exId) {
      customerId = exId.innerText;
    }
    codeAccount = opId.innerText;
  }
  console.log({ codeAccount, customerId });
  chrome.runtime.sendMessage({
    msg: 'google-ads',
    data: { codeAccount, customerId }
  });
})();
