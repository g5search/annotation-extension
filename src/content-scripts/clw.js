(function () {
  let clientUrn = null
  let locationUrn = null
  const scripts = document.querySelectorAll('head script[type="text/javascript"]');
  const scriptsArr = Array.from(scripts);
  const node = scriptsArr.find((script) => {
    return script.innerHTML.includes('G5_CLIENT_ID')
  })
  if (node) {
    const html = node.innerHTML
    const dataLayer = JSON.parse(html.substring(html.indexOf('{'), html.lastIndexOf('}') + 1));
    clientUrn = dataLayer.G5_CLIENT_ID
    locationUrn = dataLayer.G5_STORE_ID
    chrome.runtime.sendMessage({
      msg: "g5-website",
      data: { clientUrn, locationUrn },
    });
  }
})();
