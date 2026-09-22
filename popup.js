document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const mediaContent = document.getElementById("media-content");
  const notAmazon = document.getElementById("not-amazon");
  const videoContainer = document.getElementById("video-container");
  const imageContainer = document.getElementById("image-container");
  const videoCount = document.getElementById("video-count");
  const imageCount = document.getElementById("image-count");

  const showMessage = (message) => {
    loader.classList.add("hidden");
    notAmazon.textContent = message;
    notAmazon.classList.remove("hidden");
  };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !/^https:\/\/(?:[^/]+\.)?amazon\.(?:com|ca|co\.uk|de|fr|it|es|in|co\.jp|com\.au)(?:\/|$)/i.test(tab.url || "")) {
    showMessage("Please open an Amazon product page to extract media.");
    return;
  }

  const scanPage = () => new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: "get_media" }, async (response) => {
      if (!chrome.runtime.lastError) {
        resolve(response);
        return;
      }

      try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
        chrome.tabs.sendMessage(tab.id, { action: "get_media" }, (injectedResponse) => {
          if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
          else resolve(injectedResponse);
        });
      } catch (error) {
        reject(error);
      }
    });
  });

  try {
    const response = await scanPage();
    loader.classList.add("hidden");

    if (!response || (!response.videos?.length && !response.images?.length)) {
      showMessage("No downloadable videos or images found on this page.");
      return;
    }

    mediaContent.classList.remove("hidden");

    // Render Videos
    videoCount.textContent = response.videos.length;
    response.videos.forEach((videoUrl, index) => {
      const card = document.createElement("div");
      card.className = "media-card";
      const preview = document.createElement("video");
      preview.src = videoUrl;
      preview.preload = "metadata";
      const button = document.createElement("button");
      button.className = "download-btn";
      button.dataset.url = videoUrl;
      button.dataset.type = "video";
      button.dataset.index = index + 1;
      button.innerHTML = "<span>Download MP4</span>";
      card.append(preview, button);
      videoContainer.appendChild(card);
    });

    // Render Images
    imageCount.textContent = response.images.length;
    response.images.forEach((imgUrl, index) => {
      const card = document.createElement("div");
      card.className = "media-card";
      const preview = document.createElement("img");
      preview.src = imgUrl;
      preview.alt = "Product Image";
      const button = document.createElement("button");
      button.className = "download-btn";
      button.dataset.url = imgUrl;
      button.dataset.type = "image";
      button.dataset.index = index + 1;
      button.innerHTML = "<span>Download JPG</span>";
      card.append(preview, button);
      imageContainer.appendChild(card);
    });

    // Handle Downloads
    document.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const target = e.currentTarget;
        const url = target.dataset.url;
        const type = target.dataset.type;
        const idx = target.dataset.index;

        const ext = type === "video" ? "mp4" : "jpg";
        const filename = `Amazon_${type}_${idx}_${Date.now()}.${ext}`;

        target.disabled = true;
        target.querySelector("span").textContent = "Starting...";
        chrome.runtime.sendMessage({
          action: "download_file",
          url: url,
          filename: filename
        }, (result) => {
          if (chrome.runtime.lastError || !result?.ok) {
            target.disabled = false;
            target.querySelector("span").textContent = "Download failed";
            return;
          }
          target.querySelector("span").textContent = "Download started";
        });
      });
    });
  } catch (error) {
    showMessage("Unable to scan this page. Refresh Amazon and try again.");
  }
});