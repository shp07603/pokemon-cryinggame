/**
 * POKECRYING GAME
 * Updated Logic with History, Ranking, and Background Animation
 */

// --- Configuration ---
const ROUNDS = 10;
const TIME_LIMIT = 15;
const DIFFICULTIES = {
  1: { maxId: 151, label: 'EASY' },
  2: { maxId: 251, label: 'NORMAL' },
  3: { maxId: 386, label: 'HARD' }
};

// --- State ---
let state = {
  difficulty: 1,
  maxId: 151,
  currentRound: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  usedIds: [],
  currentPokemon: null,
  currentSpecies: null,
  timeLeft: TIME_LIMIT,
  timerInterval: null,
  isAnswered: false,
  hintUsed: false,
  audio: null,
  crySrc: '',
  cache: {},
  speciesCache: {}
};

// --- DOM Elements ---
const els = {
  body: document.getElementById('gameBody'),
  screens: document.querySelectorAll('.screen'),
  bgContainer: document.getElementById('bgPokemonContainer'),
  
  // Navigation
  navLinks: document.querySelectorAll('.nav-link'),
  
  // Screens
  screenStart: document.getElementById('screenStart'),
  screenGame: document.getElementById('screenGame'),
  screenEnd: document.getElementById('screenEnd'),
  screenHistory: document.getElementById('screenHistory'),
  screenRanking: document.getElementById('screenRanking'),
  
  // UI Containers
  startUI: document.getElementById('startUI'),
  gameUI: document.getElementById('gameUI'),
  endUI: document.getElementById('endUI'),

  // Game Elements
  headerScore: document.getElementById('headerScore'),
  timerBar: document.getElementById('timerBar'),
  pokemonSprite: document.getElementById('pokemonSprite'),
  unknownIcon: document.getElementById('unknownIcon'),
  playCryBtn: document.getElementById('playCryBtn'),
  hintBtn: document.getElementById('hintBtn'),
  choices: document.getElementById('choices'),
  resultMsg: document.getElementById('resultMsg'),
  nextBtnWrap: document.getElementById('nextBtnWrap'),
  streakBadge: document.getElementById('streakBadge'),
  streakCount: document.getElementById('streakCount'),
  
  // Stats
  finalScore: document.getElementById('finalScore'),
  finalGrade: document.getElementById('finalGrade'),
  statRank: document.getElementById('statRank'),
  statStreak: document.getElementById('statStreak'),
  historyList: document.getElementById('historyList'),
  rankingList: document.getElementById('rankingList'),

  // Buttons
  startBtn: document.getElementById('startBtn'),
  nextBtn: document.getElementById('nextBtn'),
  restartBtn: document.getElementById('restartBtn'),
  diffBtns: document.querySelectorAll('.diff-btn'),

  // Modals
  openTerms: document.getElementById('openTerms'),
  openPrivacy: document.getElementById('openPrivacy'),
  modalTerms: document.getElementById('modalTerms'),
  modalPrivacy: document.getElementById('modalPrivacy')
};

// --- Initialization ---
function init() {
  setupEventListeners();
  initBackgroundAnimation();
}

function setupEventListeners() {
  els.startBtn.addEventListener('click', startGame);
  els.nextBtn.addEventListener('click', nextRound);
  els.restartBtn.addEventListener('click', () => showScreen('screenStart'));
  els.playCryBtn.addEventListener('click', playCry);
  els.hintBtn.addEventListener('click', useHint);

  // Difficulty
  els.diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = parseInt(btn.dataset.diff);
      state.maxId = DIFFICULTIES[state.difficulty].maxId;
      els.diffBtns.forEach(b => b.classList.toggle('selected', b === btn));
    });
  });

  // Navigation
  document.getElementById('navHome').addEventListener('click', () => showScreen('screenStart'));
  document.getElementById('navHistory').addEventListener('click', showHistory);
  document.getElementById('navRanking').addEventListener('click', showRanking);

  // Modals
  els.openTerms.addEventListener('click', () => els.modalTerms.style.display = 'flex');
  els.openPrivacy.addEventListener('click', () => els.modalPrivacy.style.display = 'flex');
  
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => e.target.closest('.modal-overlay').style.display = 'none');
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) e.target.style.display = 'none';
  });
}

// --- Background Animation ---
function initBackgroundAnimation() {
  const ids = [1, 4, 7, 25, 39, 52, 94, 131, 133, 143, 150];
  setInterval(() => {
    spawnBackgroundPokemon(ids[Math.floor(Math.random() * ids.length)]);
  }, 3000);
}

function spawnBackgroundPokemon(id) {
  const sprite = document.createElement('img');
  sprite.className = 'bg-sprite';
  sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const moveX = (Math.random() - 0.5) * 400;
  const moveY = (Math.random() - 0.5) * 400;
  
  sprite.style.left = startX + 'px';
  sprite.style.top = startY + 'px';
  sprite.style.setProperty('--move-x', moveX + 'px');
  sprite.style.setProperty('--move-y', moveY + 'px');
  
  els.bgContainer.appendChild(sprite);
  setTimeout(() => sprite.remove(), 20000);
}

// --- Navigation Logic ---
function showScreen(id) {
  els.screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Toggle External UI
  els.startUI.classList.toggle('hidden', id !== 'screenStart');
  els.gameUI.classList.toggle('hidden', id !== 'screenGame');
  els.endUI.classList.toggle('hidden', id !== 'screenEnd');

  // Hide Title/Info during game
  els.body.classList.toggle('game-started', id === 'screenGame');
}

// --- Game Logic ---
async function startGame() {
  state = {
    ...state,
    currentRound: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    usedIds: [],
    isAnswered: false,
    hintUsed: false
  };
  
  showScreen('screenGame');
  await loadRound();
}

async function loadRound() {
  state.currentRound++;
  state.isAnswered = false;
  state.hintUsed = false;
  state.timeLeft = TIME_LIMIT;

  // Reset UI
  els.resultMsg.textContent = '';
  els.nextBtnWrap.classList.add('hidden');
  els.choices.innerHTML = '<div style="font-size:10px; text-align:center; width:100%;">LOADING...</div>';
  els.pokemonSprite.className = 'pokemon-sprite hidden-sprite';
  els.pokemonSprite.style.opacity = '0';
  els.unknownIcon.style.display = 'block';

  try {
    const answerId = getUnusedId();
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${answerId}`);
    const data = await res.json();
    state.currentPokemon = data;
    
    const speciesRes = await fetch(data.species.url);
    state.currentSpecies = await speciesRes.json();
    
    // Cry & Sprite
    state.crySrc = data.cries.latest || data.cries.legacy;
    els.pokemonSprite.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

    // Build Choices
    const options = [getKoreanName(state.currentSpecies)];
    while(options.length < 4) {
      const rid = Math.floor(Math.random() * state.maxId) + 1;
      if (rid !== answerId) {
        const rRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${rid}`);
        const rData = await rRes.json();
        const rName = getKoreanName(rData);
        if (!options.includes(rName)) options.push(rName);
      }
    }
    options.sort(() => Math.random() - 0.5);

    els.choices.innerHTML = options.map(opt => 
      `<button class="choice-btn" data-correct="${opt === getKoreanName(state.currentSpecies)}">${opt}</button>`
    ).join('');

    els.choices.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleAnswer(e.target, btn.dataset.correct === 'true'));
    });

    startTimer();
    playCry();

  } catch (err) {
    console.error(err);
    loadRound();
  }
}

function handleAnswer(btn, correct) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  clearInterval(state.timerInterval);

  if (correct) {
    const points = Math.round(state.timeLeft * 10);
    state.score += points;
    state.streak++;
    state.correctCount++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    btn.style.background = 'var(--primary)';
    els.resultMsg.textContent = '정답입니다!';
    showStreak();
  } else {
    state.streak = 0;
    btn.style.background = 'var(--error)';
    els.resultMsg.textContent = `틀렸습니다! 정답은 ${getKoreanName(state.currentSpecies)}`;
    highlightCorrect();
  }

  revealPokemon();
  els.nextBtnWrap.classList.remove('hidden');
}

function revealPokemon() {
  els.pokemonSprite.style.opacity = '1';
  els.pokemonSprite.classList.remove('hidden-sprite');
  els.unknownIcon.style.display = 'none';
}

function highlightCorrect() {
  const correctName = getKoreanName(state.currentSpecies);
  els.choices.querySelectorAll('.choice-btn').forEach(btn => {
    if (btn.textContent === correctName) btn.style.background = 'var(--primary)';
  });
}

function showStreak() {
  if (state.streak < 2) return;
  els.streakCount.textContent = state.streak;
  els.streakBadge.style.display = 'block';
  setTimeout(() => els.streakBadge.style.display = 'none', 2000);
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.timeLeft = TIME_LIMIT;
  els.timerInterval = setInterval(() => {
    state.timeLeft -= 0.1;
    els.timerBar.style.width = (state.timeLeft / TIME_LIMIT) * 100 + '%';
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleAnswer(null, false);
    }
  }, 100);
}

function playCry() {
  if (state.audio) state.audio.pause();
  state.audio = new Audio(state.crySrc);
  state.audio.volume = 0.5;
  state.audio.play();
}

function useHint() {
  if (state.isAnswered) return;
  els.pokemonSprite.style.opacity = '0.3';
  els.unknownIcon.style.display = 'none';
  state.score = Math.max(0, state.score - 5);
}

function nextRound() {
  if (state.currentRound < ROUNDS) {
    loadRound();
  } else {
    endGame();
  }
}

function getKoreanName(species) {
  const nameObj = species.names.find(n => n.language.name === 'ko');
  return nameObj ? nameObj.name : species.name;
}

function getUnusedId() {
  let id;
  do { id = Math.floor(Math.random() * state.maxId) + 1; }
  while (state.usedIds.includes(id));
  state.usedIds.push(id);
  return id;
}

// --- History & Ranking ---
function saveGame() {
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  const newGame = {
    date: new Date().toLocaleDateString(),
    score: state.score,
    correct: state.correctCount
  };
  history.unshift(newGame);
  localStorage.setItem('pokeHistory', JSON.stringify(history.slice(0, 10)));
  
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  ranking.push({ score: state.score, date: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('pokeRanking', JSON.stringify(ranking.slice(0, 5)));
}

function showHistory() {
  showScreen('screenHistory');
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  els.historyList.innerHTML = history.length ? history.map(h => 
    `<div style="margin-bottom:5px;">${h.date}: ${h.score}점 (${h.correct}/10)</div>`
  ).join('') : '기록이 없습니다.';
}

function showRanking() {
  showScreen('screenRanking');
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  els.rankingList.innerHTML = ranking.length ? ranking.map((r, i) => 
    `<div style="margin-bottom:5px;">${i+1}위: ${r.score}점 (${r.date})</div>`
  ).join('') : '순위 정보가 없습니다.';
}

function endGame() {
  saveGame();
  showScreen('screenEnd');
  els.finalScore.textContent = `${state.score} PTS`;
  els.statRank.textContent = `${Math.floor(Math.random() * 50) + 1}%`;
  els.statStreak.textContent = state.maxStreak;
  
  const pct = state.correctCount / ROUNDS;
  els.finalGrade.textContent = pct >= 0.9 ? '마스터 트레이너' : pct >= 0.7 ? '에이스 트레이너' : '신입 트레이너';
}

init();
