# 🥟 Drama Dumpling

<p align="center">
  <strong>Discover Chinese dramas based on your mood!</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-api-setup">API Setup</a> •
  <a href="#-troubleshooting">Troubleshooting</a>
</p>

---

## ✨ About

**Drama Dumpling** is a cute and modern app that helps you discover Chinese dramas based on your current mood. Whether you're in the mood for sweet romance, heart-wrenching angst, palace intrigue, xianxia fantasy, light comedy, or historical epics - Drama Dumpling finds the perfect drama for you!

The project comes in two flavors:
- 🖥️ **Chrome Extension** - For desktop Chrome users
- 🌐 **Web App** - For everyone else (mobile, tablet, any browser)

---

## 🌟 Features

### 🎭 Vibe-Based Discovery
Select your current mood and get a random Chinese drama recommendation:

| Vibe | Description |
|------|-------------|
| 🌸 **Sweet Romance** | Heart-fluttering love stories |
| 💔 **Heart-Wrenching Angst** | Emotional, tear-jerking tales |
| 👑 **Palace Power Struggle** | Imperial court intrigues |
| ✨ **Xianxia Fantasy** | Magical, immortal adventures |
| 😄 **Light Comedy** | Funny, feel-good shows |
| 🏯 **Historical Epic** | Ancient wars and dynasties |

### 📋 Smart Watchlist
- Save dramas you want to watch later
- Each saved drama remembers which vibe you selected
- Remove dramas you've already watched
- See your watchlist count at a glance

### 📤 Share Your Watchlist
- Share your curated watchlist with friends via text or social media
- Beautifully formatted with ratings, years, and vibe emojis
- One-click copy to clipboard
- Mobile-friendly sharing (Web Share API)

### 🚫 Smart Filtering
- Prevents showing the same drama twice
- Tracks recently shown dramas per vibe
- Filters out non-Chinese content
- Year filtering for modern dramas

### 📰 C-Drama Buzz
- Latest news headlines from popular C-drama blogs
- Random fun facts about Chinese dramas and actors
- Click any news item to read full article

### 🎨 Beautiful Design
- Cute, modern aesthetic with soft pastel colors
- Rounded corners and gentle shadows
- Heart ratings instead of stars
- Smooth animations and hover effects
- Floating dumplings and cherry blossom petals!

---

## 📦 Installation

### Option 1: Web App (Recommended for Everyone)

Simply visit: **https://natasha1206.github.io/drama-dumpling/**

No installation needed! Works on any device with a browser.

**Pro tip:** You can add it to your home screen:
- **iPhone/iPad**: Tap Share → "Add to Home Screen"
- **Android**: Tap Menu → "Add to Home Screen"

### Option 2: Chrome Extension (Desktop Only)

1. **Download the extension files** from [GitHub](https://github.com/natasha1206/drama-dumpling)
2. **Open Chrome** and go to `chrome://extensions`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"**
5. **Select the `chrome-extension/` folder**
6. The extension appears in your toolbar! 🎉

---

## 🔧 API Setup

This app uses **TMDB (The Movie Database)** API with a CORS proxy to work in all regions.

### Getting Your TMDB API Key:

1. Sign up at [TMDB](https://www.themoviedb.org/signup)
2. Go to your account settings
3. Click on **"API"** in the left sidebar
4. Request an API key (Developer)
5. Fill out the application form:
   - **Application Name**: Drama Dumpling
   - **Type of Use**: Personal
   - **Application Summary**: App for discovering Chinese dramas based on mood
   - **Application URL**: https://natasha1206.github.io/drama-dumpling/

6. Copy your API key and add it to the code:
   - **Web App**: Open `app.js` and replace `YOUR_TMDB_API_KEY`
   - **Chrome Extension**: Open `popup.js` and replace `YOUR_TMDB_API_KEY`

### Why a Proxy?

TMDB is blocked by some Indian ISPs (like Jio and Airtel). This app uses a free CORS proxy (`corsproxy.io`) to bypass this block and ensure it works for everyone.

---

## 🚀 Usage

### Finding a Drama

1. Select your current mood/vibe
2. Click **"find drama"**
3. Watch as a random Chinese drama appears with:
   - Poster image
   - Title and year
   - Rating (with hearts! ♥)

### Saving to Watchlist

- Click **"save to list"** to add the current drama to your watchlist
- The drama will be saved with its vibe tag
- Your watchlist is stored locally in your browser

### Managing Your Watchlist

- View all saved dramas in the **"my watchlist"** section
- Remove individual dramas by clicking the ✕ button
- **"📤 share list"** - Share your entire watchlist with friends
- **"🗑️ clear all"** - Clear your entire watchlist (with confirmation)

### News & Fun Facts

- **Refresh** - Get the latest C-drama news
- **Fun Fact** - Random trivia about Chinese dramas and actors
- **Click any news item** to read the full article

### Keyboard Shortcuts

- `Ctrl + Shift + C` - Clear watchlist and history (Chrome Extension only)

---

## 📁 Project Structure
drama-dumpling/
├── index.html # Web app (root)
├── app.js # Web app logic
├── chrome-extension/ # Chrome extension files
│ ├── manifest.json # Extension configuration
│ ├── popup.html # Extension popup UI
│ ├── popup.js # Extension logic
│ └── icons/ # Extension icons
└── README.md # This file


---

## 🛠️ Technologies Used

- **HTML5/CSS3** - Modern, responsive design
- **JavaScript (ES6+)** - Async/await, fetch API
- **TMDB API** - Drama data (posters, ratings, descriptions)
- **CORS Proxy** - Bypass regional blocks
- **RSS to JSON API** - News feed fetching
- **Chrome Extensions API** - Storage and permissions (extension only)

---

## ❓ Troubleshooting

### "No dramas found" error
- Make sure your TMDB API key is correct
- Try a different vibe - some vibes have more content
- Check your internet connection
- The API might be rate-limited, try again in a few minutes

### Posters not loading
- Some dramas may not have posters in the database
- The app will show a cute placeholder instead
- Try another drama

### News not loading
- Check your internet connection
- Click the refresh button
- News feeds may be temporarily unavailable

### Chrome Extension not loading
- Make sure "Developer mode" is enabled in `chrome://extensions`
- Check that all files are in the correct folder structure
- Look for errors in the console (right-click → Inspect)

### Web App not working on mobile
- Make sure you have an internet connection
- Try refreshing the page
- Add to home screen for best experience

### Sweet Romance vibe not finding dramas
- Romance vibe has the most lenient filters (2000+ year, no rating minimum)
- Try clicking "find drama" multiple times - there are many romance dramas!
- Check console logs for debugging info (right-click → Inspect → Console)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
    ```bash
    git commit -m 'Add some amazing feature'
    ```
4. Push to the branch
    ```bash
    git push origin feature/amazing-feature
    ```
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- TMDB for providing the drama data

- CORS Proxy for helping bypass regional blocks

- RSS2JSON for RSS feed conversion

- All C-drama lovers who inspired this project!

## 💗 Support

If you enjoy using Drama Dumpling:

- ⭐ Star this repository

- 🐛 Report bugs

- 💡 Suggest new features

- 📣 Share with friends who love C-dramas!

<p align="center"> Made with 💗 for C-drama lovers everywhere </p><p align="center"> <sub>Powered by TMDB</sub> </p> ```