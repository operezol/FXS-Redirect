chrome.storage.sync.get('redirects', (data) => {
    const redirects = data.redirects || [];
  
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        // Buscar la redirección que coincida con la URL solicitada
        const redirect = redirects.find((redirect) => redirect.source === details.url && redirect.enabled);
  
        // Si se encuentra una redirección, redirigir la solicitud
        if (redirect) {
          return { redirectUrl: redirect.destination };
        }
  
        // Permitir la solicitud original
        return {};
      },
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  });
  