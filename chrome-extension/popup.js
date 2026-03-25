// TMDB API via CORS Proxy (Works in India, No Scraping!)
const TMDB_API_KEY = '3232abf91bf9e9808d1efa86a235def3';
const PROXY_URL = 'https://corsproxy.io/?';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Strict vibe definitions with precise genre IDs and keywords
const VIBE_CONFIG = {
  romance: {
    genreIds: [10749], // Romance genre ID
    primaryKeywords: ['romance', 'love', 'romantic', 'sweet', 'relationship', 'couple', 'fall in love', 'first love', 'crush', 'dating', 'heart'],
    secondaryKeywords: ['marriage', 'wedding', 'kiss', 'date'],
    excludeKeywords: ['tragic', 'sad', 'death', 'murder', 'war', 'horror', 'crime', 'killer', 'violence', 'blood'],
    description: '🌸 Sweet Romance',
    minYear: 2000, // Very lenient year range
    minRating: 0,
    strictness: 'low'
  },
  angst: {
    genreIds: [18],
    primaryKeywords: ['tragedy', 'sad', 'heartbreak', 'tears', 'pain', 'sorrow', 'grief', 'emotional'],
    excludeKeywords: ['comedy', 'funny', 'happy', 'romantic comedy', 'lighthearted'],
    description: '💔 Heart-Wrenching Angst',
    minYear: 2018,
    minRating: 5.0
  },
  palace: {
    genreIds: [10768],
    primaryKeywords: ['palace', 'royal', 'emperor', 'empress', 'court', 'imperial', 'dynasty', 'concubine'],
    excludeKeywords: ['modern', 'contemporary', 'school', 'university', 'office', 'romantic comedy'],
    description: '👑 Palace Power Struggle',
    minYear: 2015,
    minRating: 5.0
  },
  fantasy: {
    genreIds: [10765, 14],
    primaryKeywords: ['fantasy', 'magic', 'immortal', 'supernatural', 'xianxia', 'wuxia', 'mythical', 'cultivation'],
    excludeKeywords: ['modern', 'realistic', 'documentary', 'crime', 'police'],
    description: '✨ Xianxia Fantasy',
    minYear: 2018,
    minRating: 5.0
  },
  comedy: {
    genreIds: [35],
    primaryKeywords: ['comedy', 'funny', 'humor', 'hilarious', 'lighthearted', 'romantic comedy'],
    excludeKeywords: ['tragedy', 'sad', 'serious', 'dark', 'crime', 'horror'],
    description: '😄 Light Comedy',
    minYear: 2018,
    minRating: 5.0
  },
  historical: {
    genreIds: [10768, 18],
    primaryKeywords: ['historical', 'ancient', 'period', 'epic', 'war', 'dynasty', 'kingdom', 'samurai', 'warrior'],
    excludeKeywords: ['modern', 'contemporary', 'future', 'sci-fi', 'fantasy'],
    description: '🏯 Historical Epic',
    minYear: 2015,
    minRating: 5.0
  }
};

// Track recently shown dramas per vibe
const recentDramas = {
  romance: [],
  angst: [],
  palace: [],
  fantasy: [],
  comedy: [],
  historical: []
};

let globalRecentlyShown = [];

// DOM elements
const posterImg = document.getElementById('poster');
const titleElement = document.getElementById('title');
const ratingElement = document.getElementById('rating');
const vibeTagElement = document.getElementById('vibe-tag');
const findDramaBtn = document.getElementById('findDrama');
const saveDramaBtn = document.getElementById('saveDrama');
const watchlistElement = document.getElementById('watchlist');
const watchlistCountElement = document.getElementById('watchlistCount');
const vibeButtons = document.querySelectorAll('.vibe-btn');

let currentDrama = null;
let currentVibe = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderWatchlist();
  setupVibeButtons();
  loadRecentDramas();
  
  const shareBtn = document.getElementById('shareListBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', shareWatchlist);
  }
  
  const clearBtn = document.getElementById('clearListBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearWatchlist);
  }
});

// Load recent dramas from storage
async function loadRecentDramas() {
  try {
    const result = await chrome.storage.local.get(['recentDramas', 'globalRecentlyShown']);
    if (result.recentDramas) {
      Object.assign(recentDramas, result.recentDramas);
    }
    if (result.globalRecentlyShown) {
      globalRecentlyShown = result.globalRecentlyShown;
    }
  } catch (error) {
    console.error('Error loading recent dramas:', error);
  }
}

// Save recent dramas to storage
async function saveRecentDramas() {
  try {
    await chrome.storage.local.set({ 
      recentDramas,
      globalRecentlyShown: globalRecentlyShown.slice(0, 30)
    });
  } catch (error) {
    console.error('Error saving recent dramas:', error);
  }
}

// Add to recent list
function addToRecent(drama, vibe) {
  globalRecentlyShown.unshift({
    id: drama.id,
    name: drama.name,
    timestamp: Date.now()
  });
  globalRecentlyShown = globalRecentlyShown.slice(0, 30);
  
  if (!recentDramas[vibe]) {
    recentDramas[vibe] = [];
  }
  
  recentDramas[vibe].unshift({
    id: drama.id,
    name: drama.name,
    timestamp: Date.now()
  });
  
  recentDramas[vibe] = recentDramas[vibe].slice(0, 20);
  saveRecentDramas();
}

// Check if recently shown
function isRecentlyShown(dramaId, vibe) {
  if (globalRecentlyShown.some(d => d.id === dramaId)) return true;
  if (recentDramas[vibe] && recentDramas[vibe].some(d => d.id === dramaId)) return true;
  return false;
}

// Setup vibe buttons with cute messages
function setupVibeButtons() {
  vibeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      vibeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVibe = btn.dataset.vibe;
      findDramaBtn.disabled = false;
      const vibeName = VIBE_CONFIG[currentVibe]?.description || btn.textContent;
      titleElement.textContent = `ready to find ${vibeName.toLowerCase()} 💕`;
      vibeTagElement.textContent = `🎀 ${vibeName}`;
    });
  });
}

// Strictly check if a drama matches the selected vibe
function strictlyMatchesVibe(drama, vibe) {
  const config = VIBE_CONFIG[vibe];
  if (!config) return false;
  
  const name = (drama.name || '').toLowerCase();
  const overview = (drama.overview || '').toLowerCase();
  
  // Check if it's Chinese - more lenient for romance
  const isChinese = drama.original_language === 'zh' || 
                    drama.origin_country?.includes('CN') ||
                    name.includes('chinese') ||
                    name.includes('china') ||
                    overview.includes('chinese') ||
                    overview.includes('china');
  
  // For romance, accept dramas with romance keywords even if not explicitly Chinese
  if (vibe === 'romance' && !isChinese) {
    let hasRomanceKeywords = false;
    for (const keyword of config.primaryKeywords) {
      if (name.includes(keyword) || overview.includes(keyword)) {
        hasRomanceKeywords = true;
        break;
      }
    }
    if (!hasRomanceKeywords) return false;
  } else if (!isChinese) {
    return false;
  }

  // Check year
  const year = drama.first_air_date ? parseInt(drama.first_air_date.substring(0, 4)) : 0;
  if (year > 0 && year < config.minYear) return false;
  
  // Check rating - skip rating check for romance
  if (vibe !== 'romance' && drama.vote_average < config.minRating) return false;
  
  // Check for exclude keywords
  for (const exclude of config.excludeKeywords) {
    if (name.includes(exclude) || overview.includes(exclude)) {
      return false;
    }
  }
  
  // Check for primary keywords
  let primaryMatch = false;
  for (const keyword of config.primaryKeywords) {
    if (name.includes(keyword) || overview.includes(keyword)) {
      primaryMatch = true;
      break;
    }
  }
  
  // For romance, also check genre if no keyword match
  if (vibe === 'romance' && !primaryMatch && drama.genre_ids) {
    primaryMatch = drama.genre_ids.some(id => config.genreIds.includes(id));
  }
  
  return primaryMatch;
}

// Fetch with CORS proxy
async function fetchTMDB(endpoint) {
  const url = `${TMDB_BASE}${endpoint}&api_key=${TMDB_API_KEY}`;
  const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  return await response.json();
}

// Main search function
findDramaBtn.addEventListener('click', async () => {
  if (!currentVibe) {
    alert('Please select a vibe first!');
    return;
  }
  
  try {
    showLoading();
    
    const config = VIBE_CONFIG[currentVibe];
    let foundDrama = null;
    let attempts = 0;
    let triedPages = [];
    
    const recentIds = recentDramas[currentVibe]?.map(d => d.id) || [];
    
    // More attempts for romance
    const maxAttempts = currentVibe === 'romance' ? 40 : 25;
    
    while (!foundDrama && attempts < maxAttempts) {
      attempts++;
      
      // Random page between 1 and 30 (more pages for romance)
      const maxPage = currentVibe === 'romance' ? 30 : 20;
      let page;
      do {
        page = Math.floor(Math.random() * maxPage) + 1;
      } while (triedPages.includes(page) && triedPages.length < maxPage);
      triedPages.push(page);
      
      console.log(`Attempt ${attempts}: Searching TMDB page ${page} for ${config.description}`);
      
      // Build API URL
      let url = `/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=${page}&vote_count.gte=5`;
      
      // Add rating filter only for non-romance
      if (currentVibe !== 'romance') {
        url += `&vote_average.gte=${config.minRating}`;
      }
      
      // Add genre filter
      if (config.genreIds) {
        url += `&with_genres=${config.genreIds.join('|')}`;
      }
      
      // Add year filter - more lenient for romance
      const currentYear = new Date().getFullYear();
      if (currentVibe === 'romance') {
        url += `&first_air_date.gte=2000-01-01&first_air_date.lte=${currentYear}-12-31`;
      } else {
        url += `&first_air_date.gte=${config.minYear}-01-01&first_air_date.lte=${currentYear}-12-31`;
      }
      
      const data = await fetchTMDB(url);
      
      if (data.results && data.results.length > 0) {
        console.log(`Found ${data.results.length} results on page ${page}`);
        
        const validShows = data.results.filter(show => 
          show.poster_path && 
          show.name &&
          !recentIds.includes(show.id) &&
          !isRecentlyShown(show.id, currentVibe) &&
          strictlyMatchesVibe(show, currentVibe)
        );
        
        console.log(`${validShows.length} shows matched the ${config.description} vibe`);
        
        if (validShows.length > 0) {
          const randomIndex = Math.floor(Math.random() * validShows.length);
          const show = validShows[randomIndex];
          
          foundDrama = {
            id: show.id,
            name: show.name,
            posterPath: show.poster_path,
            rating: show.vote_average,
            year: show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A',
            overview: show.overview
          };
          break;
        }
      }
    }
    
    if (foundDrama) {
      currentDrama = {
        ...foundDrama,
        vibe: currentVibe,
        vibeName: config.description
      };
      displayDrama(currentDrama);
      saveDramaBtn.disabled = false;
      addToRecent(currentDrama, currentVibe);
      console.log(`Found: ${foundDrama.name}`);
    } else {
      showError(`No ${config.description} Chinese dramas found. Try another vibe!`);
    }
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error finding dramas. Please try again!');
  }
});

// Save to watchlist
saveDramaBtn.addEventListener('click', async () => {
  if (!currentDrama) {
    alert('Please find a drama first!');
    return;
  }
  
  try {
    const result = await chrome.storage.local.get(['watchlist']);
    const watchlist = result.watchlist || [];
    
    if (!watchlist.some(item => item.id === currentDrama.id)) {
      watchlist.push({
        id: currentDrama.id,
        name: currentDrama.name,
        posterPath: currentDrama.posterPath,
        rating: currentDrama.rating,
        year: currentDrama.year,
        vibe: currentDrama.vibe,
        vibeName: currentDrama.vibeName,
        dateAdded: new Date().toISOString()
      });
      
      await chrome.storage.local.set({ watchlist });
      await renderWatchlist();
      
      saveDramaBtn.textContent = '✓ saved! 💕';
      setTimeout(() => {
        saveDramaBtn.textContent = 'save to list';
      }, 1500);
    } else {
      alert('Already in your watchlist! 💗');
    }
  } catch (error) {
    console.error('Error saving:', error);
    alert('Failed to save to watchlist');
  }
});

// Render watchlist
async function renderWatchlist() {
  try {
    const result = await chrome.storage.local.get(['watchlist']);
    const watchlist = result.watchlist || [];
    
    watchlistCountElement.textContent = watchlist.length;
    
    if (watchlist.length === 0) {
      watchlistElement.innerHTML = '<li class="empty-message">your watchlist is waiting to be filled ✨</li>';
      return;
    }
    
    watchlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    watchlistElement.innerHTML = watchlist.map(item => `
      <li>
        <span title="${item.name} (${item.year || 'N/A'})">
          ${truncateText(item.name, 20)}
          ${item.vibeName ? `<span class="vibe-badge">${getVibeEmoji(item.vibe)}</span>` : ''}
        </span>
        <button class="remove-btn" data-id="${item.id}">✕</button>
      </li>
    `).join('');
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await removeFromWatchlist(btn.dataset.id);
      });
    });
  } catch (error) {
    console.error('Error rendering watchlist:', error);
  }
}

function getVibeEmoji(vibe) {
  const emojis = {
    romance: '🌸',
    angst: '💔',
    palace: '👑',
    fantasy: '✨',
    comedy: '😄',
    historical: '🏯'
  };
  return emojis[vibe] || '🎀';
}

async function removeFromWatchlist(dramaId) {
  try {
    const result = await chrome.storage.local.get(['watchlist']);
    const watchlist = result.watchlist || [];
    const updated = watchlist.filter(item => item.id != dramaId);
    await chrome.storage.local.set({ watchlist: updated });
    await renderWatchlist();
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
}

// ============ SHARE FEATURE FUNCTIONS ============

function formatWatchlistForSharing(watchlist) {
  if (watchlist.length === 0) {
    return "✨ My C-Drama Watchlist is empty right now! Time to find some dramas! ✨";
  }
  
  const date = new Date().toLocaleDateString();
  let message = `🌸 My C-Drama Watchlist (${date}) 🌸\n\n`;
  message += `I've collected ${watchlist.length} amazing dramas to watch! 💕\n\n`;
  message += `📋 MY WATCHLIST:\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  watchlist.forEach((item, index) => {
    const vibeEmoji = getVibeEmoji(item.vibe);
    const ratingStars = item.rating >= 8 ? '♥♥♥' : item.rating >= 6 ? '♥♥♡' : '♥♡♡';
    message += `${index + 1}. ${item.name}`;
    if (item.year && item.year !== 'N/A') {
      message += ` (${item.year})`;
    }
    message += `\n   ${vibeEmoji} ${item.vibeName || '✨'} | ${ratingStars} ${item.rating || 'N/A'}/10\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ Discover your next favorite drama at C-Drama Nomad! ✨\n`;
  message += `💗 Made with love for c-drama lovers 💗`;
  
  return message;
}

async function shareWatchlist() {
  try {
    const result = await chrome.storage.local.get(['watchlist']);
    const watchlist = result.watchlist || [];
    
    if (watchlist.length === 0) {
      showToast('✨ Your watchlist is empty! Find some dramas first! ✨', 3000);
      return;
    }
    
    const shareText = formatWatchlistForSharing(watchlist);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My C-Drama Watchlist',
          text: shareText,
        });
        showToast('✨ Shared successfully! ✨', 2000);
        return;
      } catch (shareError) {
        if (shareError.name !== 'AbortError') {
          console.log('Share cancelled');
        }
      }
    }
    
    await navigator.clipboard.writeText(shareText);
    showToast('📋 Watchlist copied to clipboard! Share with friends! 💕', 3000);
    
  } catch (error) {
    console.error('Error sharing watchlist:', error);
    showToast('💔 Oops! Could not share. Try again!', 3000);
  }
}

async function clearWatchlist() {
  const confirmed = confirm('💔 Are you sure you want to clear your entire watchlist? This cannot be undone. 💔');
  
  if (confirmed) {
    try {
      await chrome.storage.local.set({ watchlist: [] });
      await renderWatchlist();
      showToast('✨ Watchlist cleared! Time to find new dramas! ✨', 3000);
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      showToast('💔 Oops! Could not clear watchlist.', 3000);
    }
  }
}

function showToast(message, duration = 3000) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// ============ END SHARE FEATURE FUNCTIONS ============

// Display functions
function displayDrama(drama) {
  if (drama.posterPath) {
    posterImg.src = `${IMAGE_BASE}${drama.posterPath}`;
    posterImg.alt = `${drama.name} poster`;
    posterImg.onerror = function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'200\' viewBox=\'0 0 150 200\'%3E%3Crect width=\'150\' height=\'200\' fill=\'%23fce4ec\'/%3E%3Ctext x=\'75\' y=\'100\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🌸 no poster 🌸%3C/text%3E%3C/svg%3E';
    };
  } else {
    posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'200\' viewBox=\'0 0 150 200\'%3E%3Crect width=\'150\' height=\'200\' fill=\'%23fce4ec\'/%3E%3Ctext x=\'75\' y=\'100\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🌸 no poster 🌸%3C/text%3E%3C/svg%3E';
  }
  
  titleElement.textContent = drama.name;
  
  if (drama.year && drama.year !== 'N/A') {
    titleElement.textContent += ` (${drama.year})`;
  }
  
  if (drama.rating && drama.rating > 0) {
    const hearts = drama.rating >= 8 ? '♥♥♥' : drama.rating >= 6 ? '♥♥♡' : '♥♡♡';
    ratingElement.textContent = `${hearts} ${drama.rating.toFixed(1)}`;
  } else {
    ratingElement.textContent = '♥♡♡';
  }
  
  if (drama.vibeName) {
    vibeTagElement.textContent = `🎀 ${drama.vibeName}`;
  }
}

function showLoading() {
  const vibeName = currentVibe ? VIBE_CONFIG[currentVibe]?.description : '';
  titleElement.textContent = `finding ${vibeName.toLowerCase()}... 💕`;
  ratingElement.textContent = '♥ ♥ ♥';
  if (currentVibe) {
    vibeTagElement.textContent = `🎀 ${VIBE_CONFIG[currentVibe]?.description}`;
  }
  posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'200\' viewBox=\'0 0 150 200\'%3E%3Crect width=\'150\' height=\'200\' fill=\'%23fce4ec\'/%3E%3Ctext x=\'75\' y=\'100\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🌸 loading... 🌸%3C/text%3E%3C/svg%3E';
}

function showError(message) {
  titleElement.textContent = 'oops! 💔';
  ratingElement.textContent = '♥ ♥ ♥';
  posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'200\' viewBox=\'0 0 150 200\'%3E%3Crect width=\'150\' height=\'200\' fill=\'%23fce4ec\'/%3E%3Ctext x=\'75\' y=\'100\' font-family=\'Arial\' font-size=\'11\' fill=\'%23ff9a9e\' text-anchor=\'middle\'%3E💔 try again 💔%3C/text%3E%3C/svg%3E';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  const dramaCard = document.querySelector('.drama-card');
  if (dramaCard) {
    dramaCard.insertBefore(errorDiv, dramaCard.firstChild);
  }
  
  setTimeout(() => errorDiv.remove(), 3000);
}

function truncateText(text, maxLength) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text || '';
}

// Clear watchlist and history (Ctrl+Shift+C)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    chrome.storage.local.remove(['watchlist', 'recentDramas', 'globalRecentlyShown']).then(() => {
      Object.keys(recentDramas).forEach(key => {
        recentDramas[key] = [];
      });
      globalRecentlyShown = [];
      renderWatchlist();
      console.log('Watchlist and history cleared ✨');
    });
  }
});