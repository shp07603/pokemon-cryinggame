/**
 * POKECRYING GAME
 * High Stability Logic with Correct Background Loops & UI Fixes
 */

const ROUNDS = 10;
const TIME_LIMIT = 15;
const DIFFICULTIES = {
  1: { maxId: 151, label: 'EASY' },
  2: { maxId: 251, label: 'NORMAL' },
  3: { maxId: 386, label: 'HARD' }
};

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

const els = {
  body: document.getElementById('gameBody'),
  screens: document.querySelectorAll('.screen'),
  bgRows: [document.getElementById('bgRow1'), document.getElementById('bgRow2'), document.getElementById('bgRow3')],
  
  headerScore: document.getElementById('headerScore'),
  timerBar: document.getElementById('timerBar'),
  pokemonSprite: document.getElementById('pokemonSprite'),
  unknownIcon: document.getElementById('unknownIcon'),
  playCryBtn: document.getElementById('playCryBtn'),
  hintBtn: document.getElementById('hintBtn'),
  choices: document.getElementById('choices'),
  resultMsg: document.getElementById('resultMsg'),
  nextBtnWrap: document.getElementById('nextBtnWrap'),
  
  finalScore: document.getElementById('finalScore'),
  finalGrade: document.getElementById('finalGrade'),
  statRank: document.getElementById('statRank'),
  statStreak: document.getElementById('statStreak'),
  historyList: document.getElementById('historyList'),
  rankingList: document.getElementById('rankingList'),

  startBtn: document.getElementById('startBtn'),
  nextBtn: document.getElementById('nextBtn'),
  restartBtn: document.getElementById('restartBtn'),
  diffBtns: document.querySelectorAll('.diff-btn'),

  startUI: document.getElementById('startUI'),
  gameUI: document.getElementById('gameUI'),
  endUI: document.getElementById('endUI'),

  modalTerms: document.getElementById('modalTerms'),
  modalPrivacy: document.getElementById('modalPrivacy')
};

// --- Initialization ---
function init() {
  setupEventListeners();
  initBackgroundRows();
}

function setupEventListeners() {
  els.startBtn.addEventListener('click', startGame);
  els.nextBtn.addEventListener('click', nextRound);
  els.restartBtn.addEventListener('click', () => showScreen('screenStart'));
  els.playCryBtn.addEventListener('click', playCry);
  els.hintBtn.addEventListener('click', useHint);

  els.diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = parseInt(btn.dataset.diff);
      state.maxId = DIFFICULTIES[state.difficulty].maxId;
      els.diffBtns.forEach(b => b.classList.toggle('selected', b === btn));
    });
  });

  document.getElementById('navHome').addEventListener('click', () => showScreen('screenStart'));
  document.getElementById('navHistory').addEventListener('click', showHistory);
  document.getElementById('navRanking').addEventListener('click', showRanking);

  document.getElementById('openTerms').addEventListener('click', () => els.modalTerms.style.display = 'flex');
  document.getElementById('openPrivacy').addEventListener('click', () => els.modalPrivacy.style.display = 'flex');
  
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => e.target.closest('.modal-overlay').style.display = 'none');
  });
}

// --- Background ---
function initBackgroundRows() {
  const ids = [1, 4, 7, 25, 39, 52, 94, 131, 133, 143, 150, 151, 172, 175, 252, 255, 258];
  els.bgRows.forEach(row => {
    if (!row) return;
    const sprites = Array(15).fill(0).map(() => {
      const id = ids[Math.floor(Math.random() * ids.length)];
      return `<img class="bg-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">`;
    }).join('');
    row.innerHTML = sprites + sprites; // Duplicate for loop
  });
}

// --- Navigation ---
function showScreen(id) {
  els.screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  els.startUI.classList.toggle('hidden', id !== 'screenStart');
  els.gameUI.classList.toggle('hidden', id !== 'screenGame');
  els.endUI.classList.toggle('hidden', id !== 'screenEnd');
  
  els.body.classList.toggle('game-started', id === 'screenGame');
  updateHeader();
}

// --- Game Logic ---
async function startGame() {
  state = { ...state, currentRound: 0, score: 0, streak: 0, maxStreak: 0, correctCount: 0, usedIds: [], isAnswered: false, hintUsed: false };
  showScreen('screenGame');
  await loadRound();
}

async function loadRound() {
  state.currentRound++;
  state.isAnswered = false;
  state.hintUsed = false;
  state.timeLeft = TIME_LIMIT;
  updateHeader();

  els.resultMsg.style.display = 'none';
  els.nextBtnWrap.classList.add('hidden');
  els.choices.innerHTML = '<div style="font-size:18px; width:100%; text-align:center; padding:20px;">LOADING...</div>';
  els.pokemonSprite.className = 'pokemon-sprite hidden-sprite';
  els.pokemonSprite.style.opacity = '0';
  els.unknownIcon.style.display = 'block';
  els.hintBtn.disabled = false;
  els.hintBtn.style.opacity = '1';

  try {
    const answerId = getUnusedId();
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${answerId}`);
    const data = await res.json();
    state.currentPokemon = data;
    
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    state.currentSpecies = speciesData;
    
    state.crySrc = data.cries.latest || data.cries.legacy;
    els.pokemonSprite.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

    const answerName = `${getKoreanName(speciesData)} (${data.name.toUpperCase()})`;
    const options = [answerName];
    
    // Fetch wrong options
    while(options.length < 4) {
      const rid = Math.floor(Math.random() * state.maxId) + 1;
      if (state.usedIds.includes(rid)) continue;
      
      const rRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${rid}`);
      const rData = await rRes.json();
      const rsRes = await fetch(rData.species.url);
      const rsData = await rsRes.json();
      const rName = `${getKoreanName(rsData)} (${rData.name.toUpperCase()})`;
      if (!options.includes(rName)) options.push(rName);
    }
    options.sort(() => Math.random() - 0.5);

    els.choices.innerHTML = options.map(opt => `<button class="choice-btn" data-correct="${opt === answerName}">${opt}</button>`).join('');
    els.choices.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleAnswer(e.currentTarget, btn.dataset.correct === 'true'));
    });

    startTimer();
    playCry();
  } catch (err) {
    console.error(err);
    setTimeout(loadRound, 1000);
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
    if(btn) btn.style.background = 'var(--primary)';
    els.resultMsg.textContent = 'CORRECT!';
    els.resultMsg.style.color = 'var(--gb-dark)';
  } else {
    state.streak = 0;
    if(btn) btn.style.background = 'var(--error)';
    els.resultMsg.textContent = 'WRONG!';
    els.resultMsg.style.color = 'var(--error)';
    highlightCorrect();
  }

  revealPokemon();
  updateHeader();
  els.resultMsg.style.display = 'block';
  els.nextBtnWrap.classList.remove('hidden');
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
  state.audio.play().catch(() => {});
}

function useHint() {
  if (state.isAnswered || state.hintUsed) return;
  state.hintUsed = true;
  state.score = Math.max(0, state.score - 50);
  updateHeader();
  
  els.pokemonSprite.style.opacity = '1';
  els.pokemonSprite.classList.add('hidden-sprite'); // Forced silhouette
  els.unknownIcon.style.display = 'none';
  els.hintBtn.disabled = true;
  els.hintBtn.style.opacity = '0.5';
}

function revealPokemon() {
  els.pokemonSprite.style.opacity = '1';
  els.pokemonSprite.classList.remove('hidden-sprite');
  els.unknownIcon.style.display = 'none';
}

function highlightCorrect() {
  const correctName = `${getKoreanName(state.currentSpecies)} (${state.currentPokemon.name.toUpperCase()})`;
  els.choices.querySelectorAll('.choice-btn').forEach(btn => {
    if (btn.textContent === correctName) btn.style.background = 'var(--primary)';
  });
}

function updateHeader() {
  els.headerScore.textContent = state.score;
}

function nextRound() {
  if (state.currentRound < ROUNDS) loadRound();
  else endGame();
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

function showHistory() {
  showScreen('screenHistory');
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  els.historyList.innerHTML = history.length ? history.map(h => 
    `<div style="margin-bottom:10px; border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:5px;">${h.date}: ${h.score} PTS</div>`
  ).join('') : 'NO DATA';
}

function showRanking() {
  showScreen('screenRanking');
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  els.rankingList.innerHTML = ranking.length ? ranking.map((r, i) => 
    `<div style="margin-bottom:10px;">${i+1}st: ${r.score} PTS (${r.date})</div>`
  ).join('') : 'NO DATA';
}

function endGame() {
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  history.unshift({ date: new Date().toLocaleDateString(), score: state.score });
  localStorage.setItem('pokeHistory', JSON.stringify(history.slice(0, 10)));
  
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  ranking.push({ score: state.score, date: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('pokeRanking', JSON.stringify(ranking.slice(0, 5)));

  showScreen('screenEnd');
  els.finalScore.textContent = `${state.score} PTS`;
  els.statRank.textContent = `TOP ${Math.floor(Math.random() * 15) + 1}%`;
  els.statStreak.textContent = state.maxStreak;
  
  const pct = state.correctCount / ROUNDS;
  els.finalGrade.textContent = pct >= 0.9 ? 'MASTER TRAINER' : pct >= 0.7 ? 'ACE TRAINER' : 'ROOKIE TRAINER';
}

init();
