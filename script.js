function getThumb(filename) {
    return filename ? `./thumbnails/${filename}` : 'https://via.placeholder.com/60?text=Music';
}

// Data for the songs with their specific local thumbnails
const songs = [
    { title: 'Animals', src: 'music/animals.mp3', thumb: getThumb('animals.jpeg') },
    { title: 'Attention', src: 'music/attention.mp3', thumb: getThumb('attention.jpeg') },
    { title: 'Bye Bye Bye', src: 'music/bye bye bye.mp3', thumb: getThumb('bye bye bye.jpeg') },
    { title: 'Die With A Smile', src: 'music/die with smile.mp3', thumb: getThumb('die with a smile.jpeg') },
    { title: 'End Of Beginning', src: 'music/end of beginning.mp3', thumb: getThumb('end of beginning.jpeg') },
    { title: 'FE!N', src: 'music/fein.mp3', thumb: getThumb('fein.jpeg') },
    { title: 'Fight Back', src: 'music/fight back.mp3', thumb: getThumb('fight back.jpeg') },
    { title: 'From The Start', src: 'music/from the start.mp3', thumb: getThumb('from the start.jpeg') },
    { title: 'I Wanna Be Yours', src: 'music/i wanna be yours.mp3', thumb: getThumb('i wanna be yojurs.jpeg') },
    { title: 'Keep Up', src: 'music/keep up.mp3', thumb: getThumb('keep up.jpeg') },
    { title: 'Montagem Rugada', src: 'music/montagem rugada.mp3', thumb: getThumb('montagem rudga.jpeg') },
    { title: 'No Batidao', src: 'music/no batido.mp3', thumb: getThumb('no batiddo.jpeg') },
    { title: 'Ordinary', src: 'music/ordinary.mp3', thumb: getThumb('ordinary.jpeg') },
    { title: 'Perfect', src: 'music/perfect.mp3', thumb: getThumb('perfect.jpeg') },
    { title: 'Shape Of You', src: 'music/shape of you.mp3', thumb: getThumb('sahpe of you.jpeg') }
];

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');
const playerTitle = document.getElementById('player-title');
const playerThumbnail = document.getElementById('player-thumbnail');
const musicCards = document.querySelectorAll('.music-card');

const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

// State Variables
let currentSongIndex = 0;
let isPlaying = false;

// --- MUSIC PLAYER LOGIC ---

// Initialize Player
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    playerTitle.textContent = song.title;
    playerThumbnail.src = song.thumb;
    // Handle broken images by falling back to placeholder
    playerThumbnail.onerror = function() {
        this.src = 'https://via.placeholder.com/60?text=Music';
    };
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶'; 
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸'; 
    }
    isPlaying = !isPlaying;
}

function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) currentSongIndex = 0;
    loadSong(currentSongIndex);
    if (isPlaying) audioPlayer.play();
}

function playPrevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
    loadSong(currentSongIndex);
    if (isPlaying) audioPlayer.play();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

function updateProgressBar() {
    const { currentTime, duration } = audioPlayer;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
    }
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function adjustVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
}

function cardPlayClicked(cardTitle) {
    const index = songs.findIndex(song => cardTitle.toLowerCase().includes(song.title.toLowerCase()) || 
                                          song.title.toLowerCase().includes(cardTitle.toLowerCase()));
    if (index !== -1) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.textContent = '⏸'; 
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);
audioPlayer.addEventListener('timeupdate', updateProgressBar);
progressBar.addEventListener('click', setProgressBar);
volumeSlider.addEventListener('input', adjustVolume);

musicCards.forEach(card => {
    const playBtn = card.querySelector('.play-button');
    const title = card.querySelector('h3').textContent;
    
    // Set initial thumbnail for existing cards
    const songIndex = songs.findIndex(s => title.toLowerCase().includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(title.toLowerCase()));
    if (songIndex !== -1) {
        const img = card.querySelector('img');
        if (img) {
            img.src = songs[songIndex].thumb;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/150?text=Music';
            };
        }
    }

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cardPlayClicked(title);
    });
});

loadSong(currentSongIndex);

// --- TABS & SEARCH LOGIC ---

// Switch between sections (Home, Search, Library)
function switchTab(e) {
    e.preventDefault();
    // Remove active class from all links and hide all sections
    navLinks.forEach(link => link.classList.remove('active-tab'));
    tabContents.forEach(content => content.style.display = 'none');
    
    // Add active class to clicked link and show targeted section
    this.classList.add('active-tab');
    const targetId = this.getAttribute('data-target');
    document.getElementById(targetId).style.display = 'block';
}

navLinks.forEach(link => {
    link.addEventListener('click', switchTab);
});

// Search Filtering Logic
function renderSearchResults(query) {
    // Clear current results
    searchResultsContainer.innerHTML = '';
    
    if (query.trim() === '') return; // Don't show anything if search is empty
    
    // Filter songs roughly by title
    const filtered = songs.filter(song => song.title.toLowerCase().includes(query.toLowerCase()));
    
    if (filtered.length === 0) {
        searchResultsContainer.innerHTML = '<p style="padding-left: 20px;">No songs found.</p>';
        return;
    }
    
    // Generate HTML for each matched song
    filtered.forEach(song => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <img src="${song.thumb}" alt="${song.title}" onerror="this.src='https://via.placeholder.com/150?text=Music'">
            <h3>${song.title}</h3>
            <div class="play-button">▶</div>
        `;
        
        // Attach click listener to new dynamic cards
        const playBtn = card.querySelector('.play-button');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cardPlayClicked(song.title);
        });
        
        searchResultsContainer.appendChild(card);
    });
}

searchInput.addEventListener('input', (e) => {
    // Basic debounce could be added, but for simple local array, direct filtering is fine.
    renderSearchResults(e.target.value);
});
