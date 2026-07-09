// ============================================
// Weather Vibe
// ============================================

const API_KEY = 'ebd11cfd3a0931c4d9578fd7f0d82681';

// ============================================
// 🖼️ WEATHER IMAGE MAP
// ============================================

const weatherImages = {
    '01d': 'images/clear-day.jpg',
    '01n': 'images/clear-night.jpg',
    '02d': 'images/cloudy-day.jpg',
    '02n': 'images/cloudy-night.jpg',
    '03d': 'images/cloudy-day.jpg',
    '03n': 'images/cloudy-night.jpg',
    '04d': 'images/cloudy-day.jpg',
    '04n': 'images/cloudy-night.jpg',
    '09d': 'images/light-rain.jpg',
    '09n': 'images/light-rain.jpg',
    '10d': 'images/light-rain.jpg',
    '10n': 'images/light-rain.jpg',
    '11d': 'images/heavy-rain.jpg',
    '11n': 'images/heavy-rain.jpg',
    '13d': 'images/snow.jpg',
    '13n': 'images/snow.jpg',
    '50d': 'images/fog.jpg',
    '50n': 'images/fog.jpg'
};

const DEFAULT_IMAGE = 'images/clear-day.jpg';

// ============================================
// 🎨 THEME COLORS
// ============================================

const weatherThemes = {
    '01d': {
        overlay: 'rgba(0, 0, 0, 0.1)',
        cardBg: 'rgba(255, 255, 255, 0.2)',
        textMain: '#ffffff',
        textLight: '#f0f0f0',
        accent: '#ffd700',
        accentSoft: 'rgba(255, 215, 0, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.3)'
    },
    '01n': {
        overlay: 'rgba(0, 0, 0, 0.25)',
        cardBg: 'rgba(255, 255, 255, 0.15)',
        textMain: '#ffffff',
        textLight: '#d0d0e0',
        accent: '#a5b4fc',
        accentSoft: 'rgba(165, 180, 252, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.4)'
    },
    '02d': {
        overlay: 'rgba(0, 0, 0, 0.15)',
        cardBg: 'rgba(255, 255, 255, 0.2)',
        textMain: '#ffffff',
        textLight: '#e0e0e0',
        accent: '#c0c0c0',
        accentSoft: 'rgba(192, 192, 192, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.3)'
    },
    '02n': {
        overlay: 'rgba(0, 0, 0, 0.3)',
        cardBg: 'rgba(255, 255, 255, 0.15)',
        textMain: '#ffffff',
        textLight: '#c0c0d0',
        accent: '#b8b8d8',
        accentSoft: 'rgba(184, 184, 216, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.4)'
    },
    'rain': {
        overlay: 'rgba(0, 0, 0, 0.2)',
        cardBg: 'rgba(255, 255, 255, 0.2)',
        textMain: '#ffffff',
        textLight: '#d0e0f0',
        accent: '#7eb8da',
        accentSoft: 'rgba(126, 184, 218, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.35)'
    },
    'snow': {
        overlay: 'rgba(0, 0, 0, 0.15)',
        cardBg: 'rgba(255, 255, 255, 0.25)',
        textMain: '#ffffff',
        textLight: '#e0f0ff',
        accent: '#90cdf4',
        accentSoft: 'rgba(144, 205, 244, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.3)'
    },
    'fog': {
        overlay: 'rgba(0, 0, 0, 0.2)',
        cardBg: 'rgba(255, 255, 255, 0.2)',
        textMain: '#ffffff',
        textLight: '#e0e8e0',
        accent: '#a8c6a8',
        accentSoft: 'rgba(168, 198, 168, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.3)'
    }
};

// ============================================
// 🎯 DOM Elements
// ============================================

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');
const locationBadge = document.getElementById('locationBadge');
const regionEmoji = document.getElementById('regionEmoji');
const regionName = document.getElementById('regionName');

const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');

// ============================================
// 🎨 APPLY WEATHER THEME
// ============================================

function applyWeatherTheme(iconCode) {
    const root = document.documentElement;
    
    const imagePath = weatherImages[iconCode] || DEFAULT_IMAGE;
    
    let themeKey = iconCode;
    if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
        themeKey = iconCode.endsWith('n') ? '02n' : '02d';
    }
    if (iconCode.startsWith('09') || iconCode.startsWith('10') || iconCode.startsWith('11')) {
        themeKey = 'rain';
    }
    if (iconCode.startsWith('13')) themeKey = 'snow';
    if (iconCode.startsWith('50')) themeKey = 'fog';
    
    const theme = weatherThemes[themeKey] || weatherThemes['01d'];
    
    root.style.setProperty('--bg-image', `url('${imagePath}')`);
    root.style.setProperty('--overlay', theme.overlay);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--text-main', theme.textMain);
    root.style.setProperty('--text-light', theme.textLight);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-soft', theme.accentSoft);
    root.style.setProperty('--shadow', theme.shadow);
    
    regionEmoji.textContent = getWeatherEmoji(iconCode);
    regionName.textContent = getWeatherLabel(iconCode);
    
    console.log(`🌦️ Weather: ${iconCode} → ${imagePath}`);
}

function getWeatherLabel(iconCode) {
    const labels = {
        '01d': 'Sunny Day', '01n': 'Clear Night',
        '02d': 'Partly Cloudy', '02n': 'Partly Cloudy',
        '03d': 'Cloudy', '03n': 'Cloudy',
        '04d': 'Overcast', '04n': 'Overcast',
        '09d': 'Light Rain', '09n': 'Light Rain',
        '10d': 'Rainy Day', '10n': 'Rainy Night',
        '11d': 'Thunderstorm', '11n': 'Thunderstorm',
        '13d': 'Snowy', '13n': 'Snowy',
        '50d': 'Foggy', '50n': 'Foggy'
    };
    return labels[iconCode] || 'Weather';
}

function getWeatherEmoji(iconCode) {
    const emojis = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌦️', '09n': '🌧️',
        '10d': '🌧️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return emojis[iconCode] || '🌡️';
}

// ============================================
// 🌤️ FETCH WEATHER
// ============================================

async function fetchWeather(city) {
    try {
        loading.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
        errorMsg.classList.add('hidden');
        locationBadge.classList.add('hidden');
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const iconCode = data.weather[0].icon;
        applyWeatherTheme(iconCode);
        
        displayWeather(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError();
    } finally {
        loading.classList.add('hidden');
    }
}

// ============================================
// 🖥️ DISPLAY WEATHER
// ============================================

function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherDisplay.classList.remove('hidden');
    locationBadge.classList.remove('hidden');
    errorMsg.classList.add('hidden');
}

// ============================================
// ❌ ERROR
// ============================================

function showError() {
    weatherDisplay.classList.add('hidden');
    locationBadge.classList.add('hidden');
    errorMsg.classList.remove('hidden');
}

// ============================================
// 🎮 EVENTS
// ============================================

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

cityInput.focus();