chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('redirects', (data) => {
    const redirects = data.redirects || [];

    const blockingRules = [];

    redirects.forEach((redirect) => {
      if (redirect.enabled) {
        const matcher = new chrome.declarativeWebRequest.RequestMatcher({
          url: { hostSuffix: redirect.source }
        });

        const blockingRule = {
          conditions: [matcher],
          actions: [
            new chrome.declarativeWebRequest.RedirectRequest({ redirectUrl: redirect.destination })
          ]
        };

        blockingRules.push(blockingRule);
      }
    });
    chrome.declarativeWebRequest.onRequest.addRules(blockingRules);
  });
});
