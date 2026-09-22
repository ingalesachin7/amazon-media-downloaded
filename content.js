chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_media") {
    const videos = new Set();
    const images = new Set();

    const addVideo = (url) => {
      if (!url || url.startsWith("blob:") || url.startsWith("data:")) return;

      try {
        const resolvedUrl = new URL(url, document.baseURI).href;
        if (resolvedUrl.startsWith("http")) videos.add(resolvedUrl);
      } catch {
        // Ignore malformed URLs from page metadata.
      }
    };

    // Scan for HTML5 Video tags
    document.querySelectorAll("video").forEach((v) => {
      addVideo(v.currentSrc || v.src);
      v.querySelectorAll("source").forEach((s) => addVideo(s.src || s.getAttribute("src")));
    });

    // Amazon often preloads product videos without attaching them to a video tag.
    performance.getEntriesByType("resource").forEach((entry) => {
      if (/\.(mp4|mov|webm)(\?|$)/i.test(entry.name)) addVideo(entry.name);
    });

    // Also inspect common JSON attributes used by the product gallery.
    document.querySelectorAll("[data-video-url], [data-video], script").forEach((element) => {
      const text = element.getAttribute("data-video-url") ||
        element.getAttribute("data-video") || element.textContent || "";
      const normalizedText = text.replaceAll("\\/", "/");
      const matches = normalizedText.match(/https?:[^\"'\\s]+\.(?:mp4|mov|webm)(?:\?[^\"'\\s]*)?/gi) || [];
      matches.forEach(addVideo);
    });

    // Scan for gallery product images (converting thumbnails to high res)
    document.querySelectorAll("img").forEach((img) => {
      let src = img.src || img.getAttribute("data-src");
      if (src && /(?:media-amazon\.com|images-amazon\.com|amazon\.com\/images)/i.test(src)) {
        // Strip common scale/crop suffixes to fetch highest quality
        try {
          const imageUrl = new URL(src, document.baseURI);
          imageUrl.pathname = imageUrl.pathname
            .replace(/_\d+x\d+(?=\.[a-z0-9]+$)/i, "")
            .replace(/\.(webp|avif)$/i, ".jpg");
          images.add(imageUrl.href);
        } catch {
          // Ignore malformed image URLs.
        }
      }
    });

    sendResponse({
      videos: Array.from(videos),
      images: Array.from(images).slice(0, 10) // Limit to top 10 main images
    });
  }
  return true;
});