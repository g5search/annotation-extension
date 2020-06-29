(function() {
  let codeAccount;
  const exId = document.querySelector('div.external-customer-id');
  const opId = document.querySelector('div.operating-customer > .id');
  if (!opId) {
    codeAccount = '';
  } else {
    if (!exId || !exId.hasOwnProperty('innerText')) {
      codeAccount = ''
    }
    codeAccount = opId.innerText;
  }
  chrome.runtime.sendMessage({
    msg: 'google-ads',
    data: { codeAccount, customerId: undefined }
  });
})();
