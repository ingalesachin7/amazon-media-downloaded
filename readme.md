# Amazon Media Downloader (Images & Videos) 🚀

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Amazon Media Downloader** is a powerful Manifest V3 Chrome Extension designed to help e-commerce sellers, dropshippers, content creators, and researchers extract, preview, and download high-resolution images, variant photos, and embedded product videos directly from Amazon product listing pages.

---

## ✨ Features

- 🎥 **High-Definition Video Downloader:** Detects and downloads embedded product videos and review videos in original HD quality (`.mp4`).
- 📸 **HD Image Extractor:** Strips thumbnail compression and resolution caps to fetch the maximum quality available for gallery images.
- 🎨 **Variant Photo Support:** Extracts media across different color, size, and style options.
- ⚡ **One-Click Downloads:** Download individual media items directly into your local machine using Chrome's native download API.
- 🛡️ **Privacy Focused:** Completely client-side processing. No external servers track your browsing or save downloaded media.

---

## 🛠️ Installation & Setup

### Install in Developer Mode

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ingalesachin7/amazon-media-downloaded.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right toggle switch.
4. Click **Load unpacked** in the top-left menu.
5. Select the folder containing the extension files.

---

## 🚀 How to Use

1. Navigate to any Amazon product listing page (`amazon.com`, `amazon.in`, `amazon.co.uk`, etc.).
2. Click the **Amazon Media Downloader** extension icon in your browser toolbar.
3. The popup will automatically scan the page for available high-resolution images and videos.
4. Click **Download MP4** or **Download JPG** next to any media item.

---

## 📂 Directory Structure

```text
amazon-media-downloaded/
├── manifest.json       # Extension Manifest V3 configuration
├── popup.html          # Extension popup user interface
├── popup.css           # Modern dark-theme styles
├── popup.js            # UI logic & media rendering
├── content.js          # DOM media extraction script
├── background.js       # Background service worker for downloads
├── icons/              # Extension icons (16x16, 48x48, 128x128)
└── README.md           # Project documentation
```

---

## 🌐 Supported Marketplaces

Fully compatible across Amazon global domains, including:
- Amazon US (`.com`)
- Amazon UK (`.co.uk`)
- Amazon India (`.in`)
- Amazon Canada (`.ca`)
- Amazon Germany (`.de`)
- Amazon Japan (`.co.jp`)

---

## 📜 Disclaimer

This extension is an independent tool and is NOT affiliated with, authorized, maintained, sponsored, or endorsed by Amazon.com, Inc. or any of its affiliates.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.