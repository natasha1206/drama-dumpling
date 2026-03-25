C-Drama Nomad Explorer
======================

Discover Chinese dramas based on your mood! 🌸

About
-----

C-Drama Nomad Explorer is a beautiful Chrome extension that helps you discover Chinese dramas based on your current mood. Whether you're in the mood for sweet romance, heart-wrenching angst, palace intrigue, xianxia fantasy, light comedy, or historical epics - this extension finds the perfect drama for you!

Built with love for C-drama lovers, this extension features:

*   Cute, modern design with soft pink aesthetics
    
*   Mood-based drama discovery
    
*   Save dramas to your personal watchlist
    
*   Share your watchlist with friends
    
*   Smart filtering to avoid repeats
    

Features
--------

### Vibe-Based Discovery

Select your current mood and get a random Chinese drama recommendation:

*   Sweet Romance - Heart-fluttering love stories
    
*   Heart-Wrenching Angst - Emotional, tear-jerking tales
    
*   Palace Power Struggle - Imperial court intrigues
    
*   Xianxia Fantasy - Magical, immortal adventures
    
*   Light Comedy - Funny, feel-good shows
    
*   Historical Epic - Ancient wars and dynasties
    

### Smart Watchlist

*   Save dramas you want to watch later
    
*   Each saved drama remembers which vibe you selected
    
*   Remove dramas you've already watched
    
*   See your watchlist count at a glance
    

### Share Your Watchlist

*   Share your curated watchlist with friends via text or social media
    
*   Beautifully formatted with ratings, years, and vibe emojis
    
*   One-click copy to clipboard
    
*   Mobile-friendly sharing (Web Share API)
    

### Smart Filtering

*   Prevents showing the same drama twice
    
*   Tracks recently shown dramas per vibe
    
*   Filters out non-Chinese content
    
*   Year filtering for modern dramas
    

### Beautiful Design

*   Soft pink and cream color palette
    
*   Rounded corners and gentle shadows
    
*   Heart ratings instead of stars
    
*   Smooth hover animations
    
*   Cute emoji accents throughout
    

Installation
------------

### From Source (Developer Mode)

1.  Download or clone this repository  
    ```
    git clone https://github.com/yourusername/c-drama-nomad-explorer.git

    ```
    
2.  Get a TMDB API Key (Free)
    
    *   Go to TMDB ([themoviedb.org](https://themoviedb.org/)) and create an account
        
    *   Navigate to Settings → API
        
    *   Request an API key (Developer)
        
    *   Copy your API key
        
3.  Add your API key
    
    *   Open 'popup.js'
        
    *   Find 'const TMDB\_API\_KEY = 'YOUR\_TMDB\_API\_KEY';'
        
    *   Replace with your actual API key
        
4.  Load the extension in Chrome
    
    *   Open Chrome and go to 'chrome://extensions'
        
    *   Enable "Developer mode" (toggle in top-right)
        
    *   Click "Load unpacked"
        
    *   Select the folder containing the extension files
        
5.  Start discovering dramas! 🎉
    

Usage
-----

### Finding a Drama

1.  Click the extension icon in your Chrome toolbar
    
2.  Select your current mood/vibe by clicking one of the buttons:
    
    *   Sweet Romance
        
    *   Heart-Wrenching Angst
        
    *   Palace Power Struggle
        
    *   Xianxia Fantasy
        
    *   Light Comedy
        
    *   Historical Epic
        
3.  Click "find drama"
    
4.  Watch as a random Chinese drama appears with:
    
    *   Poster image
        
    *   Title and year
        
    *   Rating (with hearts! ♥)
        

### Saving to Watchlist

*   Click "save to list" to add the current drama to your watchlist
    
*   The drama will be saved with its vibe tag
    
*   Your watchlist is stored locally in Chrome storage
    

### Managing Your Watchlist

*   View all saved dramas in the "my watchlist" section
    
*   Remove individual dramas by clicking the ✕ button
    
*   "📤 share list" - Share your entire watchlist with friends
    
*   "🗑️ clear all" - Clear your entire watchlist (with confirmation)
    

### Keyboard Shortcuts

*   'Ctrl + Shift + C' - Clear watchlist and history (useful for testing)
    

API Setup
---------

This extension uses TMDB (The Movie Database) API with a CORS proxy to work in India.

### Getting Your TMDB API Key:

1.  Sign up at TMDB ([themoviedb.org/signup](https://themoviedb.org/signup))
    
2.  Go to your account settings
    
3.  Click on "API" in the left sidebar
    
4.  Request an API key (Developer)
    
5.  Fill out the application form:
    
    *   Application Name: C-Drama Nomad Explorer
        
    *   Type of Use: Personal
        
    *   Application Summary: Chrome extension for discovering Chinese dramas based on mood/vibe
        
    *   Application URL: [https://github.com/yourusername/c-drama-nomad-explorer](https://github.com/yourusername/c-drama-nomad-explorer)
        
6.  Copy your API key and add it to 'popup.js'
    

### Why a Proxy?

TMDB is blocked by some Indian ISPs (like Jio and Airtel). This extension uses a free CORS proxy ([corsproxy.io](https://corsproxy.io/)) to bypass this block and ensure the extension works for all users.

File Structure
--------------

c-drama-nomad-explorer/  
├── manifest.json # Extension configuration  
├── popup.html # Main popup interface  
├── popup.js # Extension logic  
├── icons/ # Extension icons  
│ ├── icon16.png  
│ ├── icon48.png  
│ └── icon128.png  
└── README.md # This file

Technologies Used
-----------------

*   HTML5/CSS3 - Modern, responsive design
    
*   JavaScript (ES6+) - Async/await, fetch API
    
*   Chrome Extensions API - Storage and permissions
    
*   TMDB API - Drama data (posters, ratings, descriptions)
    
*   CORS Proxy - Bypass regional blocks
    

Troubleshooting
---------------

### "No dramas found" error

*   Make sure your TMDB API key is correct
    
*   Try a different vibe - some vibes have more content
    
*   Check your internet connection
    
*   The API might be rate-limited, try again in a few minutes
    

### Posters not loading

*   Some dramas may not have posters in the database
    
*   The extension will show a cute placeholder instead
    
*   Try another drama
    

### Extension not loading in Chrome

*   Make sure "Developer mode" is enabled
    
*   Check that all files are in the correct folder structure
    
*   Look for errors in the console (right-click → Inspect)
    

### API Key not working

*   Verify you copied the key correctly (no extra spaces)
    
*   Make sure you requested a "Developer" API key, not a "Standard" one
    
*   Wait a few minutes after requesting the key for it to activate
    

### Sweet Romance vibe not finding dramas

*   Romance vibe has the most lenient filters (2000+ year, no rating minimum)
    
*   Try clicking "find drama" multiple times - there are many romance dramas!
    
*   Check console logs for debugging info (right-click → Inspect → Console)
    

### Areas for Improvement

*   Add more vibes/moods
    
*   Add drama details page
    
*   Add search functionality
    
*   Sync watchlist across devices
    
*   Add drama ratings from MyDramaList
    

License
-------

This project is licensed under the MIT License.

Acknowledgments
---------------

*   TMDB for providing the drama data
    
*   CORS Proxy for helping bypass regional blocks
    
*   All C-drama lovers who inspired this project!
    

Version History
---------------

### v1.0.0 (Current)

*   Initial release
    
*   6 vibes for mood-based discovery
    
*   Watchlist with local storage
    
*   Share watchlist feature
    
*   Cute modern design
    
*   Smart repeat prevention
    
*   Chinese drama filtering