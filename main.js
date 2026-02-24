/**
 * PokeCry: Pokemon Cry Quiz Game
 * Core Logic - Optimized for High Quality & Stability
 */

// --- Configuration ---
const ROUNDS = 10;
const TIME_LIMIT = 15;
const DIFFICULTIES = {
  1: { maxId: 151, label: 'CLASSIC (1세대)' },
  2: { maxId: 251, label: 'JOHTO (1~2세대)' },
  3: { maxId: 386, label: 'HOENN (1~3세대)' }
};

// --- State Management ---
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
  screens: document.querySelectorAll('.screen'),
  headerScore: document.getElementById('headerScore'),
  headerRound: document.getElementById('headerRound'),
  timerBar: document.getElementById('timerBar'),
  timerLabel: document.getElementById('timerLabel'),
  pokemonSprite: document.getElementById('pokemonSprite'),
  unknownIcon: document.getElementById('unknownIcon'),
  scanRing: document.getElementById('scanRing'),
  waveform: document.getElementById('waveform'),
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
  statCorrect: document.getElementById('statCorrect'),
  statStreak: document.getElementById('statStreak'),
  statRank: document.getElementById('statRank'),
  statDiff: document.getElementById('statDiff'),

  // Buttons
  startBtn: document.getElementById('startBtn'),
  nextBtn: document.getElementById('nextBtn'),
  restartBtn: document.getElementById('restartBtn'),
  goStartBtn: document.getElementById('goStartBtn'),
  diffBtns: document.querySelectorAll('.diff-btn'),

  // UI Layers
  startUI: document.getElementById('startUI'),
  gameUI: document.getElementById('gameUI'),
  endUI: document.getElementById('endUI')
};

// --- Initialization ---
function init() {
  setupEventListeners();
}

function setupEventListeners() {
  els.startBtn.addEventListener('click', startGame);
  els.nextBtn.addEventListener('click', nextRound);
  els.restartBtn.addEventListener('click', startGame);
  els.goStartBtn.addEventListener('click', () => showScreen('screenStart'));
  els.playCryBtn.addEventListener('click', playCry);
  els.hintBtn.addEventListener('click', useHint);

  els.diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = parseInt(btn.dataset.diff);
      setDifficulty(diff);
      els.diffBtns.forEach(b => b.classList.toggle('selected', b === btn));
    });
  });
}

// --- Navigation ---
function showScreen(id) {
  els.screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Toggle external UI layers
  els.startUI.classList.toggle('hidden', id !== 'screenStart');
  els.gameUI.classList.toggle('hidden', id !== 'screenGame');
  els.endUI.classList.toggle('hidden', id !== 'screenEnd');
}

// --- Difficulty ---
function setDifficulty(d) {
  state.difficulty = d;
  state.maxId = DIFFICULTIES[d].maxId;
}

// --- Waveform Decor ---
function buildWaveform() {
  if (!els.waveform) return;
  els.waveform.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.setProperty('--dur', (0.4 + Math.random() * 0.4) + 's');
    bar.style.setProperty('--max', (15 + Math.random() * 25) + 'px');
    els.waveform.appendChild(bar);
  }
}

function setWaveActive(active) {
  const bars = els.waveform.querySelectorAll('.wave-bar');
  bars.forEach((b, i) => {
    if (active) {
      b.classList.add('active');
      b.style.animationDelay = (i * 0.04) + 's';
    } else {
      b.classList.remove('active');
      b.style.height = '4px';
    }
  });
  els.scanRing.classList.toggle('playing', active);
}

// --- Data Fetching ---
async function fetchPokemon(id) {
  if (state.cache[id]) return state.cache[id];
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    state.cache[id] = data;
    return data;
  } catch (err) {
    console.error(`Failed to fetch Pokemon ${id}`, err);
    return null;
  }
}

async function fetchSpecies(id) {
  if (state.speciesCache[id]) return state.speciesCache[id];
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    state.speciesCache[id] = data;
    return data;
  } catch (err) {
    console.error(`Failed to fetch Species ${id}`, err);
    return null;
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUnusedId() {
  let id;
  let attempts = 0;
  do {
    id = randInt(1, state.maxId);
    attempts++;
  } while (state.usedIds.includes(id) && attempts < 100);
  state.usedIds.push(id);
  return id;
}

function getKoreanName(species) {
  if (!species) return '???';
  const nameObj = species.names.find(n => n.language.name === 'ko');
  return nameObj ? nameObj.name : species.name;
}

// --- Game Flow ---
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
  
  updateHeader();
  showScreen('screenGame');
  buildWaveform();
  await loadRound();
}

async function loadRound() {
  state.currentRound++;
  state.isAnswered = false;
  state.hintUsed = false;
  state.timeLeft = TIME_LIMIT;
  updateHeader();

  // Reset UI
  els.resultMsg.style.display = 'none';
  els.resultMsg.className = 'result-msg';
  els.nextBtnWrap.classList.add('hidden');
  els.choices.innerHTML = '<div style="font-size:12px;color:var(--gb-dark);text-align:center;padding:30px;grid-column:1/-1">데이터 통신 중...</div>';
  els.playCryBtn.disabled = true;
  els.hintBtn.disabled = false;
  els.hintBtn.style.opacity = '1';
  els.pokemonSprite.className = 'pokemon-sprite hidden-sprite';
  els.pokemonSprite.style.opacity = '0';
  els.unknownIcon.classList.remove('hidden');
  els.pokemonSprite.src = '';

  try {
    const answerId = getUnusedId();
    const [pokemon, species] = await Promise.all([
      fetchPokemon(answerId),
      fetchSpecies(answerId)
    ]);
    
    state.currentPokemon = pokemon;
    state.currentSpecies = species;
    
    if (!pokemon || !species) throw new Error('No Pokemon data');

    const wrongIds = new Set();
    while (wrongIds.size < 3) {
      const wid = randInt(1, state.maxId);
      if (wid !== answerId) wrongIds.add(wid);
    }
    
    const wrongDataPromises = [...wrongIds].map(async id => {
        const [p, s] = await Promise.all([fetchPokemon(id), fetchSpecies(id)]);
        return { pokemon: p, species: s };
    });
    
    const wrongData = await Promise.all(wrongDataPromises);

    const sprite = state.currentPokemon.sprites?.other?.['official-artwork']?.front_default
                 || state.currentPokemon.sprites?.front_default;
    els.pokemonSprite.src = sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    
    state.crySrc = state.currentPokemon.cries?.latest || state.currentPokemon.cries?.legacy;

    const options = [
      { name: getKoreanName(state.currentSpecies), correct: true },
      ...wrongData.map(d => ({ name: getKoreanName(d.species), correct: false }))
    ].sort(() => Math.random() - 0.5);

    els.choices.innerHTML = options.map(opt => 
      `<button class="choice-btn" data-correct="${opt.correct}">${opt.name}</button>`
    ).join('');

    els.choices.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleAnswer(e.currentTarget, btn.dataset.correct === 'true'));
    });

    els.playCryBtn.disabled = false;
    setTimeout(() => { if (!state.isAnswered) playCry(); }, 600);
    startTimer();

  } catch (err) {
    console.error(err);
    els.choices.innerHTML = '<div style="font-size:12px;color:var(--error);text-align:center;grid-column:1/-1">연결 실패. 재시도 중...</div>';
    setTimeout(() => {
      state.usedIds.pop();
      state.currentRound--;
      loadRound();
    }, 2000);
  }
}

// --- Sound ---
function playCry() {
  if (!state.crySrc) return;
  if (state.audio) { state.audio.pause(); state.audio.currentTime = 0; }
  
  state.audio = new Audio(state.crySrc);
  state.audio.volume = 0.6;
  setWaveActive(true);
  els.playCryBtn.disabled = true;
  
  state.audio.play().catch(err => console.error("Audio failed", err));
  state.audio.onended = () => {
    setWaveActive(false);
    if (!state.isAnswered) els.playCryBtn.disabled = false;
  };
}

function stopCry() {
  if (state.audio) { state.audio.pause(); state.audio.currentTime = 0; }
  setWaveActive(false);
  els.playCryBtn.disabled = true;
}

// --- Hint ---
function useHint() {
  if (state.isAnswered || state.hintUsed) return;
  state.hintUsed = true;
  state.score = Math.max(0, state.score - 5);
  updateHeader();
  
  els.pokemonSprite.style.opacity = '1'; 
  els.unknownIcon.classList.add('hidden');
  els.hintBtn.disabled = true;
  els.hintBtn.style.opacity = '0.5';
}

// --- Timer ---
function startTimer() {
  clearInterval(state.timerInterval);
  state.timeLeft = TIME_LIMIT;
  updateTimerUI();
  
  state.timerInterval = setInterval(() => {
    state.timeLeft -= 0.1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateTimerUI();
      clearInterval(state.timerInterval);
      if (!state.isAnswered) handleTimeUp();
    } else {
      updateTimerUI();
    }
  }, 100);
}

function updateTimerUI() {
  const pct = (state.timeLeft / TIME_LIMIT) * 100;
  els.timerBar.style.width = pct + '%';
  els.timerLabel.textContent = Math.ceil(state.timeLeft) + 'S';
}

// --- Game Logic ---
function handleAnswer(btn, correct) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  clearInterval(state.timerInterval);
  stopCry();

  if (correct) {
    const points = Math.max(10, Math.round(state.timeLeft * 10));
    state.score += points;
    state.streak++;
    state.correctCount++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    btn.classList.add('correct');
    showResult(true, `정답! +${points}점`);
    showStreak();
  } else {
    state.streak = 0;
    btn.classList.add('wrong');
    showResult(false, '아쉽네요... 오답!');
    highlightCorrect();
  }

  revealPokemon();
  disableChoices();
  els.hintBtn.disabled = true;
  updateHeader();
  els.nextBtnWrap.classList.remove('hidden');
}

function handleTimeUp() {
  state.isAnswered = true;
  stopCry();
  state.streak = 0;
  showResult(false, '시간 초과!');
  revealPokemon();
  highlightCorrect();
  disableChoices();
  updateHeader();
  els.nextBtnWrap.classList.remove('hidden');
}

function highlightCorrect() {
  const correctName = getKoreanName(state.currentSpecies);
  els.choices.querySelectorAll('.choice-btn').forEach(btn => {
    if (btn.textContent === correctName) btn.classList.add('correct');
  });
}

function disableChoices() {
  els.choices.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
}

function revealPokemon() {
  els.pokemonSprite.style.opacity = '1';
  els.unknownIcon.classList.add('hidden');
  els.pokemonSprite.classList.remove('hidden-sprite');
}

function showResult(correct, msg) {
  const name = getKoreanName(state.currentSpecies);
  els.resultMsg.textContent = `${msg} [ 정답: ${name} ]`;
  els.resultMsg.style.display = 'block';
  els.resultMsg.classList.add('show', correct ? 'correct-msg' : 'wrong-msg');
}

function showStreak() {
  if (state.streak < 2) return;
  els.streakCount.textContent = state.streak;
  els.streakBadge.style.display = 'block';
  setTimeout(() => { els.streakBadge.style.display = 'none'; }, 2500);
}

function updateHeader() {
  els.headerScore.textContent = state.score;
  els.headerRound.textContent = state.currentRound || '-';
}

function nextRound() {
  if (state.currentRound >= ROUNDS) {
    endGame();
  } else {
    loadRound();
  }
}

// --- Ranking ---
function calculateRank(score) {
  if (score >= 1400) return '0.1%';
  if (score >= 1200) return '1%';
  if (score >= 1000) return '5%';
  if (score >= 800) return '10%';
  if (score >= 600) return '20%';
  if (score >= 400) return '40%';
  if (score >= 200) return '60%';
  return '90%';
}

function endGame() {
  showScreen('screenEnd');
  els.finalScore.textContent = `${state.score} PTS`;

  const pct = state.correctCount / ROUNDS;
  let grade, color;
  if (pct >= 0.9) { grade = '🏆 전설의 마스터'; color = '#059669'; }
  else if (pct >= 0.7) { grade = '⭐ 일류 트레이너'; color = '#059669'; }
  else if (pct >= 0.5) { grade = '🌱 견습 트레이너'; color = '#d97706'; }
  else { grade = '😅 더 노력하세요!'; color = '#dc2626'; }

  els.finalGrade.textContent = grade;
  els.finalGrade.style.color = color;
  els.statRank.textContent = calculateRank(state.score);
  els.statCorrect.textContent = `${state.correctCount} / ${ROUNDS}`;
  els.statStreak.textContent = `${state.maxStreak} Combo`;
  els.statDiff.textContent = DIFFICULTIES[state.difficulty].label;
}

// --- Start ---
init();
