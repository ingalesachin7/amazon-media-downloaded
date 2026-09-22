chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download_file") {
    const senderIsExtension = sender.id === chrome.runtime.id;
    let isAllowedMediaHost = false;
    try {
      const mediaHost = new URL(message.url).hostname.toLowerCase();
      isAllowedMediaHost = /(?:^|\.)(?:amazon\.(?:com|ca|co\.uk|de|fr|it|es|in|co\.jp|com\.au)|media-amazon\.com|images-amazon\.com)$/i.test(mediaHost);
    } catch {
      isAllowedMediaHost = false;
    }
    const isValidUrl = typeof message.url === "string" &&
      /^https:\/\//i.test(message.url) && isAllowedMediaHost;
    const isValidFilename = typeof message.filename === "string" &&
      /^[a-z0-9_.-]+\.(?:mp4|mov|webm|jpg|jpeg)$/i.test(message.filename);

    if (!senderIsExtension || !isValidUrl || !isValidFilename) {
      sendResponse({ ok: false, error: "Invalid download request." });
      return false;
    }

    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          ok: false,
          error: chrome.runtime.lastError.message
        });
        return;
      }

      sendResponse({ ok: true, downloadId });
    });

    return true;
  }
});