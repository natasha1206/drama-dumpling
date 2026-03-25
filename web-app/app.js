// TMDB API via CORS Proxy (Works in India, No Scraping!)
const TMDB_API_KEY = '3232abf91bf9e9808d1efa86a235def3';
const PROXY_URL = 'https://corsproxy.io/?';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Vibe configuration
const VIBE_CONFIG = {
  romance: {
    genreIds: [10749],
    primaryKeywords: ['romance', 'love', 'romantic', 'sweet', 'relationship', 'couple', 'fall in love', 'first love', 'crush', 'dating', 'heart'],
    excludeKeywords: ['tragic', 'sad', 'death', 'murder', 'war', 'horror', 'crime', 'killer', 'violence', 'blood'],
    description: '🌸 Sweet Romance',
    minYear: 2000,
    minRating: 0
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
    excludeKeywords: ['modern', 'contemporary', 'school', 'university', 'office'],
    description: '👑 Palace Power Struggle',
    minYear: 2015,
    minRating: 5.0
  },
  fantasy: {
    genreIds: [10765, 14],
    primaryKeywords: ['fantasy', 'magic', 'immortal', 'supernatural', 'xianxia', 'wuxia', 'mythical', 'cultivation'],
    excludeKeywords: ['modern', 'realistic', 'documentary', 'crime'],
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
    primaryKeywords: ['historical', 'ancient', 'period', 'epic', 'war', 'dynasty', 'kingdom'],
    excludeKeywords: ['modern', 'contemporary', 'future', 'sci-fi', 'fantasy'],
    description: '🏯 Historical Epic',
    minYear: 2015,
    minRating: 5.0
  }
};

// ============ STORAGE FUNCTIONS ============

function loadWatchlist() {
  const saved = localStorage.getItem('dramaWatchlist');
  return saved ? JSON.parse(saved) : [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem('dramaWatchlist', JSON.stringify(watchlist));
}

function loadRecentDramas() {
  try {
    const saved = localStorage.getItem('recentDramasData');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.recentDramas) {
        Object.assign(recentDramas, data.recentDramas);
      }
      if (data.globalRecentlyShown) {
        globalRecentlyShown = data.globalRecentlyShown;
      }
    }
  } catch (error) {
    console.error('Error loading recent dramas:', error);
  }
}

function saveRecentDramas() {
  try {
    localStorage.setItem('recentDramasData', JSON.stringify({
      recentDramas,
      globalRecentlyShown: globalRecentlyShown.slice(0, 30)
    }));
  } catch (error) {
    console.error('Error saving recent dramas:', error);
  }
}

// ============ STATE ============

const recentDramas = {
  romance: [], angst: [], palace: [], fantasy: [], comedy: [], historical: []
};
let globalRecentlyShown = [];
let currentDrama = null;
let currentVibe = null;

// ============ DOM ELEMENTS ============

const posterImg = document.getElementById('poster');
const titleElement = document.getElementById('title');
const ratingElement = document.getElementById('rating');
const vibeTagElement = document.getElementById('vibe-tag');
const findDramaBtn = document.getElementById('findDrama');
const saveDramaBtn = document.getElementById('saveDrama');
const watchlistElement = document.getElementById('watchlist');
const watchlistCountElement = document.getElementById('watchlistCount');
const vibeCards = document.querySelectorAll('.vibe-card');

// ============ FUNCTIONS ============

function addToRecent(drama, vibe) {
  globalRecentlyShown.unshift({ id: drama.id, name: drama.name, timestamp: Date.now() });
  globalRecentlyShown = globalRecentlyShown.slice(0, 30);
  
  if (!recentDramas[vibe]) recentDramas[vibe] = [];
  recentDramas[vibe].unshift({ id: drama.id, name: drama.name, timestamp: Date.now() });
  recentDramas[vibe] = recentDramas[vibe].slice(0, 20);
  saveRecentDramas();
}

function isRecentlyShown(dramaId, vibe) {
  if (globalRecentlyShown.some(d => d.id === dramaId)) return true;
  if (recentDramas[vibe] && recentDramas[vibe].some(d => d.id === dramaId)) return true;
  return false;
}

// Setup vibe cards
function setupVibeButtons() {
  vibeCards.forEach(card => {
    card.addEventListener('click', () => {
      vibeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentVibe = card.dataset.vibe;
      findDramaBtn.disabled = false;
      const vibeName = VIBE_CONFIG[currentVibe]?.description || card.querySelector('.vibe-name').textContent;
      titleElement.textContent = `ready to find ${vibeName.toLowerCase()} 💕`;
      vibeTagElement.textContent = `🎀 ${vibeName}`;
    });
  });
}

// Strictly check if a drama matches the vibe
function strictlyMatchesVibe(drama, vibe) {
  const config = VIBE_CONFIG[vibe];
  if (!config) return false;
  
  const name = (drama.name || '').toLowerCase();
  const overview = (drama.overview || '').toLowerCase();
  
  const isChinese = drama.original_language === 'zh' || 
                    drama.origin_country?.includes('CN') ||
                    name.includes('chinese') || name.includes('china') ||
                    overview.includes('chinese') || overview.includes('china');
  
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

  const year = drama.first_air_date ? parseInt(drama.first_air_date.substring(0, 4)) : 0;
  if (year > 0 && year < config.minYear) return false;
  
  if (vibe !== 'romance' && drama.vote_average < config.minRating) return false;
  
  for (const exclude of config.excludeKeywords) {
    if (name.includes(exclude) || overview.includes(exclude)) return false;
  }
  
  let primaryMatch = false;
  for (const keyword of config.primaryKeywords) {
    if (name.includes(keyword) || overview.includes(keyword)) {
      primaryMatch = true;
      break;
    }
  }
  
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
    const maxAttempts = currentVibe === 'romance' ? 40 : 25;
    
    while (!foundDrama && attempts < maxAttempts) {
      attempts++;
      
      const maxPage = currentVibe === 'romance' ? 30 : 20;
      let page;
      do {
        page = Math.floor(Math.random() * maxPage) + 1;
      } while (triedPages.includes(page) && triedPages.length < maxPage);
      triedPages.push(page);
      
      let url = `/discover/tv?with_original_language=zh&sort_by=popularity.desc&page=${page}&vote_count.gte=5`;
      
      if (currentVibe !== 'romance') {
        url += `&vote_average.gte=${config.minRating}`;
      }
      
      if (config.genreIds) {
        url += `&with_genres=${config.genreIds.join('|')}`;
      }
      
      const currentYear = new Date().getFullYear();
      if (currentVibe === 'romance') {
        url += `&first_air_date.gte=2000-01-01&first_air_date.lte=${currentYear}-12-31`;
      } else {
        url += `&first_air_date.gte=${config.minYear}-01-01&first_air_date.lte=${currentYear}-12-31`;
      }
      
      const data = await fetchTMDB(url);
      
      if (data.results && data.results.length > 0) {
        const validShows = data.results.filter(show => 
          show.poster_path && show.name &&
          !recentIds.includes(show.id) &&
          !isRecentlyShown(show.id, currentVibe) &&
          strictlyMatchesVibe(show, currentVibe)
        );
        
        if (validShows.length > 0) {
          const randomIndex = Math.floor(Math.random() * validShows.length);
          const show = validShows[randomIndex];
          
          foundDrama = {
            id: show.id,
            name: show.name,
            posterPath: show.poster_path,
            rating: show.vote_average,
            year: show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A'
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
    const watchlist = loadWatchlist();
    
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
      
      saveWatchlist(watchlist);
      await renderWatchlist();
      
      saveDramaBtn.textContent = '✓ saved! 💕';
      setTimeout(() => {
        saveDramaBtn.textContent = '📌 save to list';
      }, 1500);
    } else {
      showToast('Already in your watchlist! 💗', 2000);
    }
  } catch (error) {
    console.error('Error saving:', error);
    showToast('Failed to save to watchlist', 2000);
  }
});

// Render watchlist
async function renderWatchlist() {
  try {
    const watchlist = loadWatchlist();
    
    watchlistCountElement.textContent = watchlist.length;
    
    if (watchlist.length === 0) {
      watchlistElement.innerHTML = '<li class="empty-message">✨ your watchlist is waiting to be filled ✨</li>';
      return;
    }
    
    watchlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    watchlistElement.innerHTML = watchlist.map(item => `
      <li>
        <span title="${item.name} (${item.year || 'N/A'})">
          ${truncateText(item.name, 25)}
          ${item.vibeName ? `<span class="vibe-badge">${getVibeEmoji(item.vibe)} ${item.vibeName.split(' ')[0]}</span>` : ''}
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
    romance: '🌸', angst: '💔', palace: '👑', fantasy: '✨', comedy: '😄', historical: '🏯'
  };
  return emojis[vibe] || '🎀';
}

async function removeFromWatchlist(dramaId) {
  try {
    const watchlist = loadWatchlist();
    const updated = watchlist.filter(item => item.id != dramaId);
    saveWatchlist(updated);
    await renderWatchlist();
    showToast('Removed from watchlist 💕', 1500);
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
}

// ============ SHARE FUNCTIONS ============

function formatWatchlistForSharing(watchlist) {
  if (watchlist.length === 0) {
    return "✨ My Drama Dumpling watchlist is empty! Time to find some dramas! ✨";
  }
  
  const date = new Date().toLocaleDateString();
  let message = `🥟 My Drama Dumpling Watchlist (${date}) 🥟\n\n`;
  message += `I've collected ${watchlist.length} amazing dramas to watch! 💕\n\n`;
  message += `📋 MY WATCHLIST:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  watchlist.forEach((item, index) => {
    const vibeEmoji = getVibeEmoji(item.vibe);
    const ratingStars = item.rating >= 8 ? '♥♥♥' : item.rating >= 6 ? '♥♥♡' : '♥♡♡';
    message += `${index + 1}. ${item.name}`;
    if (item.year && item.year !== 'N/A') message += ` (${item.year})`;
    message += `\n   ${vibeEmoji} ${item.vibeName || '✨'} | ${ratingStars} ${item.rating || 'N/A'}/10\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Discover your next favorite drama at Drama Dumpling! ✨\n💗 Made with love for c-drama lovers 💗`;
  return message;
}

async function shareWatchlist() {
  try {
    const watchlist = loadWatchlist();
    if (watchlist.length === 0) {
      showToast('✨ Your watchlist is empty! Find some dramas first! ✨', 3000);
      return;
    }
    
    const shareText = formatWatchlistForSharing(watchlist);
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Drama Dumpling Watchlist', text: shareText });
        showToast('✨ Shared successfully! ✨', 2000);
        return;
      } catch (e) { if (e.name !== 'AbortError') console.log('Share cancelled'); }
    }
    
    await copyToClipboardSmart(shareText);
  } catch (error) {
    console.error('Error sharing:', error);
    showToast('💔 Oops! Could not share. Try again!', 3000);
  }
}

async function copyToClipboardSmart(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard! Share with friends 💕', 2500);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('📋 Copied to clipboard! Share with friends 💕', 2500);
    } catch (e) {
      showToast('💔 Could not copy. Please copy manually.', 2500);
    }
    document.body.removeChild(textarea);
  }
}

async function clearWatchlist() {
  const confirmed = confirm('💔 Are you sure you want to clear your entire watchlist? This cannot be undone. 💔');
  if (confirmed) {
    saveWatchlist([]);
    await renderWatchlist();
    showToast('✨ Watchlist cleared! Time to find new dramas! ✨', 3000);
  }
}

function showToast(message, duration = 3000) {
  const existingToast = document.querySelector('.smart-toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'smart-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #2d2a2a 0%, #1f1818 100%);
    color: #ffb7c3;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 14px;
    z-index: 10000;
    animation: slideUpSmart 0.3s ease;
    border: 1px solid #ffb7c3;
    backdrop-filter: blur(10px);
    max-width: 90%;
    text-align: center;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideDownSmart 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============ NEWS & FUN FACTS ============

// RSS to JSON API
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// Chinese drama news sources
const NEWS_SOURCES = [
  { name: 'DramaPanda', url: 'https://dramapanda.com/feed', icon: '🐼' },
  { name: 'MyDramaList News', url: 'https://mydramalist.com/feeds/news', icon: '📋' },
  { name: 'KoalaPlay', url: 'https://koalaplayground.com/feed', icon: '🐨' }
];

// Fun facts database
const FUN_FACTS = [
  "🎭 Xiao Zhan was a graphic designer before becoming an actor!",
  "🎬 Wang Yibo is a professional motorcycle racer - he even won championships!",
  "🌸 Yang Zi started acting at age 7 in the drama 'Ruyi's Royal Love'!",
  "✨ Dilraba Dilmurat's name means 'beautiful flower' in Uyghur!",
  "💕 Zhao Lusi learned dance for 8 years before becoming an actress!",
  "🎯 Luo Yunxi trained in ballet for 11 years!",
  "📺 'The Untamed' filmed for 4 months in 3 different cities across China!",
  "🌸 'Love Between Fairy and Devil' took 2 years of post-production for special effects!",
  "👑 'Story of Yanxi Palace' had over 200 costumes for the main character alone!",
  "✨ 'Eternal Love' (Ten Miles of Peach Blossoms) had 80% of scenes shot with green screen!",
  "🎬 'Nirvana in Fire' won over 20 awards including Best Drama!",
  "📖 'Joy of Life' is based on a novel with over 3 million characters!",
  "💔 'Goodbye My Princess' was filmed in Mongolia and China's Gobi Desert!",
  "🏆 The first Chinese drama aired in 1958 - 'A Mouthful of Vegetable Soup'!",
  "📱 C-dramas are now streamed in over 100 countries worldwide!",
  "💰 The highest budget C-drama cost over $50 million to produce!",
  "🌍 'The Untamed' has over 10 billion views globally!",
  "🎭 Many C-drama actors train in Peking Opera for period drama roles!",
  "📚 Over 60% of popular C-dramas are adapted from novels!",
  "🍜 Actors often gain weight for roles - Xiao Zhan ate 8 meals a day for one drama!",
  "💕 Many C-drama couples become trending topics for fans to 'ship'!",
  "🎤 Many C-drama actors release OST songs for their dramas!",
  "📸 Costume dramas can take 3+ hours just for hair and makeup!",
  "💎 Costumes in palace dramas can cost over $10,000 each!"
];

// Fetch news from RSS feeds
async function fetchDramaNews() {
  const newsContainer = document.getElementById('newsList');
  if (newsContainer) {
    newsContainer.innerHTML = '<div class="loading-news">📡 fetching latest news...</div>';
  }
  
  let allNews = [];
  
  for (const source of NEWS_SOURCES) {
    try {
      const response = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(source.url)}`);
      const data = await response.json();
      
      if (data.status === 'ok' && data.items) {
        const sourceNews = data.items.slice(0, 3).map(item => ({
          title: item.title,
          link: item.link,
          source: source.name,
          icon: source.icon,
          date: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'recent'
        }));
        allNews = [...allNews, ...sourceNews];
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
    }
  }
  
  // Sort by date (newest first)
  allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Display news
  displayNews(allNews);
}

// Display news in UI
function displayNews(newsItems) {
  const newsContainer = document.getElementById('newsList');
  
  if (!newsContainer) return;
  
  if (newsItems.length === 0) {
    newsContainer.innerHTML = `
      <div class="empty-message">
        📭 No news at the moment. Check back later!
      </div>
    `;
    return;
  }
  
  newsContainer.innerHTML = newsItems.map(item => `
    <div class="news-item" onclick="window.open('${item.link}', '_blank')">
      <div class="news-title">${escapeHtml(item.icon || '📰')} ${escapeHtml(item.title)}</div>
      <div class="news-source">
        <span>${item.source}</span>
        <span class="news-date">${item.date}</span>
      </div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show random fun fact
function showFunFact() {
  const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  
  const toast = document.createElement('div');
  toast.className = 'fact-toast';
  toast.textContent = randomFact;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDownSmart 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Refresh news
function refreshNews() {
  fetchDramaNews();
}

// Add animation styles for toast
function addToastStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUpSmart {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    @keyframes slideDownSmart {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(30px);
      }
    }
  `;
  document.head.appendChild(style);
}

// ============ DISPLAY FUNCTIONS ============

function displayDrama(drama) {
  if (drama.posterPath) {
    posterImg.src = `${IMAGE_BASE}${drama.posterPath}`;
    posterImg.onerror = function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'340\' viewBox=\'0 0 240 340\'%3E%3Crect width=\'240\' height=\'340\' fill=\'%233a2c2c\'/%3E%3Ctext x=\'120\' y=\'170\' font-family=\'Arial\' font-size=\'48\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🥟%3C/text%3E%3C/svg%3E';
    };
  } else {
    posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'340\' viewBox=\'0 0 240 340\'%3E%3Crect width=\'240\' height=\'340\' fill=\'%233a2c2c\'/%3E%3Ctext x=\'120\' y=\'170\' font-family=\'Arial\' font-size=\'48\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🥟%3C/text%3E%3C/svg%3E';
  }
  
  titleElement.textContent = drama.name;
  if (drama.year && drama.year !== 'N/A') titleElement.textContent += ` (${drama.year})`;
  
  if (drama.rating && drama.rating > 0) {
    const hearts = drama.rating >= 8 ? '♥♥♥' : drama.rating >= 6 ? '♥♥♡' : '♥♡♡';
    ratingElement.textContent = `${hearts} ${drama.rating.toFixed(1)}`;
  } else {
    ratingElement.textContent = '♥♡♡';
  }
  
  if (drama.vibeName) vibeTagElement.textContent = `🎀 ${drama.vibeName}`;
}

function showLoading() {
  const vibeName = currentVibe ? VIBE_CONFIG[currentVibe]?.description : '';
  titleElement.textContent = `finding ${vibeName.toLowerCase()}... 💕`;
  ratingElement.textContent = '♥ ♥ ♥';
  if (currentVibe) vibeTagElement.textContent = `🎀 ${VIBE_CONFIG[currentVibe]?.description}`;
  posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'340\' viewBox=\'0 0 240 340\'%3E%3Crect width=\'240\' height=\'340\' fill=\'%233a2c2c\'/%3E%3Ctext x=\'120\' y=\'170\' font-family=\'Arial\' font-size=\'48\' fill=\'%23ffb7c3\' text-anchor=\'middle\'%3E🥟%3C/text%3E%3C/svg%3E';
}

function showError(message) {
  titleElement.textContent = 'oops! 💔';
  ratingElement.textContent = '♥ ♥ ♥';
  posterImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'340\' viewBox=\'0 0 240 340\'%3E%3Crect width=\'240\' height=\'340\' fill=\'%233a2c2c\'/%3E%3Ctext x=\'120\' y=\'170\' font-family=\'Arial\' font-size=\'32\' fill=\'%23ff9a9e\' text-anchor=\'middle\'%3E💔%3C/text%3E%3C/svg%3E';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  const dramaSection = document.querySelector('.drama-section');
  if (dramaSection) dramaSection.insertBefore(errorDiv, dramaSection.firstChild);
  setTimeout(() => errorDiv.remove(), 3000);
}

function truncateText(text, maxLength) {
  if (text && text.length > maxLength) return text.substring(0, maxLength) + '...';
  return text || '';
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  renderWatchlist();
  setupVibeButtons();
  loadRecentDramas();
  addToastStyles();
  
  // Fetch news on load
  fetchDramaNews();
  
  // News buttons
  const refreshBtn = document.getElementById('refreshNewsBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshNews);
  
  const funFactBtn = document.getElementById('funFactBtn');
  if (funFactBtn) funFactBtn.addEventListener('click', showFunFact);
  
  // Share buttons
  const shareBtn = document.getElementById('shareListBtn');
  if (shareBtn) shareBtn.addEventListener('click', shareWatchlist);
  
  const clearBtn = document.getElementById('clearListBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearWatchlist);
});